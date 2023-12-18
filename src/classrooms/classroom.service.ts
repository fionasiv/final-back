import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { Classroom } from "./classroom.model";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Types } from "mongoose";
import { Student } from "src/students/student.model";
import { StudentService } from "src/students/student.service";

@Injectable()
export class ClassroomService {
  private classrooms: Classroom[] = [];
  private readonly studentService: StudentService;

  constructor(
    @InjectModel(Classroom.name) private classroomsModel: Model<Classroom>
  ) {}

  async insertClassroom(_id: string, name: string, numberOfSeats: number) {
    const numberOfSeatsLeft = numberOfSeats; 
    const newClassroom = new this.classroomsModel({
      _id: new Types.ObjectId(),
      name,
      numberOfSeats,
      numberOfSeatsLeft,
    });
    const result = await this.classroomsModel.create(newClassroom);

    return result;
  }

  async getClassrooms(): Promise<Classroom[]> {
    const classrooms = await this.classroomsModel.find().populate("students");

    return classrooms;
  }

  async getClassroomById(classroomId: string) {
    let classroom: Classroom;

    try {
      classroom = await this.getPopulatedClassroom(classroomId);
    } catch (error) {
      throw new NotFoundException("Could not find classroom");
    }

    if (!classroom) {
      throw new NotFoundException("Could not find classroom");
    }

    return classroom;
  }

  async deleteClassroom(classroomId: string) {
    const result = await this.classroomsModel.deleteOne({ _id: classroomId });

    if (result.deletedCount === 0) {
      throw new NotFoundException("Could not find classroom");
    }

    return result;
  }

  async addStudentToClassroom(classId: string, studentId: string) {
    const classroom = await this.getPopulatedClassroom(classId);
    
    if (!classroom) {
      throw new NotFoundException("classroom not found");
    } else {
      const isInClassroom = await this.isStudentInClassroom(classId, studentId);
      if (isInClassroom) {
        throw new UnprocessableEntityException("student already exists in class");
      } else {
        return classroom.updateOne({
          $addToSet: { students: new mongoose.Types.ObjectId(studentId) },
          $inc: { numberOfSeatsLeft: -1 },
        });
      }
    }
  }

  async removeStudentFromClassroom(classId: string, studentId: string) {
    const classroom = await this.getPopulatedClassroom(classId);
    console.log(studentId)

    if (!classroom) {
      throw new NotFoundException("classroom not found");
    } else {
      const isInClassroom = await this.isStudentInClassroom(classId, studentId);
      if (!isInClassroom) {
        throw new NotFoundException("student not exists in class");
      } else {
        return classroom.updateOne({
          $inc: { numberOfSeatsLeft: 1 },
          $pull: { students: new mongoose.Types.ObjectId(studentId) },
        });
      }
    }
  }

  async getClassroomStudents(classId: string) {
    const classroom = await this.getPopulatedClassroom(classId);

    if (!classroom) {
      throw new NotFoundException("classroom not found");
    }

    return classroom.students;
  }

  async getAvailableClasses() {
    const classrooms = await this.getClassrooms();

    return classrooms.filter((classroom) => classroom.numberOfSeatsLeft > 0).map((classroom) => {
      return {
        id: classroom._id,
        name: classroom.name
      }
    });
  }

  private async getPopulatedClassroom(classId: string) {

    return await this.classroomsModel
      .findById(new Types.ObjectId(classId))
      .populate("students");
  }

  private async isStudentInClassroom(classId: string, studentId: string) {
    const students = await this.getClassroomStudents(classId);
    const student = students.find(
      (student: Student) => student._id.toString() === studentId
    );

    return student ? true : false;
  }
}
