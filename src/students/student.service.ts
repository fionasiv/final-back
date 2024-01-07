import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model, startSession } from "mongoose";
import { ClassroomService } from "src/classrooms/classroom.service";
import { Student } from "./student.schema";
import { validate } from "@nestjs/class-validator";

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentsModel: Model<Student>,
    @Inject(ClassroomService) private classroomService: ClassroomService
  ) {}

  async insertStudent(student: Student): Promise<void> {
    try {
      student.age = student.age ? student.age : undefined;
      const newStudentObject = new this.studentsModel(student);
      validate(newStudentObject);

      await newStudentObject.save();
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        console.error("Duplicate key error. Student already exists!");
        throw new ConflictException("student already exists");
      } else {
        console.error("An error occurred:", error);
        throw error;
      }
    }
  }

  async getStudents(): Promise<Student[]> {
    try {
      return await this.studentsModel.find().lean();
    } catch (error) {
      throw error;
    }
  }

  async deleteStudent(studentId: string): Promise<void> {
    const student = await this.getStudentById(studentId);
    const classId = student.classroom;

    if (classId) {
      await this.classroomService.updateSeats(classId, 1);
    }

    try {
      const result = await this.studentsModel
        .deleteOne({ _id: studentId })
        .exec();

      if (result.deletedCount === 0) {
        throw new NotFoundException("Could not find student");
      }
    } catch (error) {
      if (error.code === 1) {
        console.error("Document not found:", error.message);
        throw new NotFoundException("Could not find document");
      } else {
        console.error("Unexpected error:", error.message);
        throw error;
      }
    }
  }

  async getClassroomStudents(classId: string): Promise<Student[]> {
    try {
      return await this.studentsModel.find({ classroom: classId }).lean();
    } catch (error) {
      throw error;
    }
  }

  async addStudentToClass(
    classId: string,
    studentId: string
  ): Promise<Student> {
    const classroom = await this.classroomService.getClassroomById(classId);

    if (!classroom) {
      throw new BadRequestException("classroom does not exist");
    } else {
      const session = await this.studentsModel.startSession();
      session.startTransaction();

      const student = await this.getStudentById(studentId);
      student.classroom = classId;
      await student.save();

      await this.classroomService.updateSeats(classId, -1);

      session.commitTransaction();
      session.endSession();

      return student;
    }
  }

  async removeStudentFromClass(studentId: string) {
    const student = await this.getStudentById(studentId);
    if (student.classroom === "") {
      throw new BadRequestException("student is not in a classroom");
    } else {
      const session = await this.studentsModel.startSession();
      session.startTransaction();

      const classId = student.classroom;
      student.classroom = "";
      await student.save();

      await this.classroomService.updateSeats(classId, 1);

      session.commitTransaction();
      session.endSession();

      return student;
    }
  }

  private async getStudentById(studentId: string) {
    const student = await this.studentsModel.findById(studentId).exec();

    if (!student) {
      throw new NotFoundException("Could not find student");
    }

    return student;
  }
}
