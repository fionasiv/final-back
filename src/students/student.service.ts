import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { ClassroomService } from "src/classrooms/classroom.service";
import { Seats } from "src/enums";
import { DeleteResult } from "mongodb";
import { Student } from "./student.schema";
import { fieldChecks } from "src/consts";

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentsModel: Model<Student>,
    @Inject(ClassroomService) private classroomService: ClassroomService
  ) {}

  async insertStudent(student: Student): Promise<void> {
    try {
      this.validateStudent(student);
      const newStudent = {
        ...student,
        classroom: "",
      };
      const newStudentObject = new this.studentsModel(newStudent);
      
      await newStudentObject.save();
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        console.error("Duplicate key error. Student already exists!");
        throw new BadRequestException("student already exists");
      } else {
        console.error("An error occurred:", error);
        throw error;
      }
    }
  }

  async getStudents(): Promise<Student[]> {
    const students = await this.studentsModel.find().exec();

    return students;
  }

  async deleteStudent(studentId: string): Promise<void> {
    const student = await this.getStudentById(studentId);
    const classId = student.classroom;

    if (classId) {
      await this.classroomService.updateSeats(classId, Seats.AVAILABLE);
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
    const students = await this.studentsModel
      .find({ classroom: classId })
      .exec();

    return students;
  }

  async addStudentToClass(
    classId: string,
    studentId: string
  ): Promise<Student> {
    const classroom = await this.classroomService.getClassroomById(classId);

    if (!classroom) {
      throw new BadRequestException("classroom does not exist");
    } else {
      const student = await this.getStudentById(studentId);
      student.classroom = classId;
      await student.save();
  
      await this.classroomService.updateSeats(classId, Seats.TAKEN);
  
      return student;
    }
  }

  async removeStudentFromClass(studentId: string): Promise<Student & Document> {
    const student = await this.getStudentById(studentId);
    if (student.classroom === "") {
      throw new BadRequestException("student is not in a classroom");
    } else {
      const classId = student.classroom;
      student.classroom = "";
      await student.save();

      await this.classroomService.updateSeats(classId, Seats.AVAILABLE);

      return student;
    }
  }

  private async getStudentById(
    studentId: string
  ) {
    const student = await this.studentsModel.findById(studentId).exec();

    if (!student) {
      throw new NotFoundException("Could not find student");
    }

    return student;
  }

  private validateStudent(student: Student) {
    const isValid =
      fieldChecks.idCheck(student._id) &&
      fieldChecks.nameCheck(student.firstName) &&
      fieldChecks.nameCheck(student.lastName) &&
      fieldChecks.ageCheck(student.age) &&
      fieldChecks.onlyLettersCheck(student.profession);

    if (!isValid) {
      throw new UnprocessableEntityException("student params are invalid");
    }

    return isValid;
  }
}
