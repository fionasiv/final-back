import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Student } from "./student.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ClassroomService } from "src/classrooms/classroom.service";
import { Seats } from "src/enums";

@Injectable()
export class StudentService {
  private students: Student[] = [];

  constructor(
    @InjectModel(Student.name) private studentsModel: Model<Student>,
    @Inject(ClassroomService) private classroomService: ClassroomService
  ) {}

  async insertStudent(
    _id: string,
    firstName: string,
    lastName: string,
    age: number,
    profession: string,
  ) {
    const newStudent = new this.studentsModel({
      _id: _id,
      firstName,
      lastName,
      age,
      profession,
      classroom: "",
    });
    const result = await this.studentsModel.create(newStudent);

    return result;
  }

  async getStudents(): Promise<Student[]> {
    const students = await this.studentsModel.find();

    return students;
  }

  async getStudentById(studentId: string) {
    let student: Student;

    try {
      student = await this.studentsModel.findById(studentId).exec();
    } catch (error) {
      throw new NotFoundException("Could not find student");
    }

    if (!student) {
      throw new NotFoundException("Could not find student");
    }

    return student;
  }

  async deleteStudent(studentId: string) {
    const result = await this.studentsModel
      .deleteOne({ _id: studentId })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException("Could not find student");
    }

    return result;
  }

  async getClassroomStudents(classId: string) {
    const students = await this.getStudents();

    return students.filter(student => student.classroom === classId);
  }

  async addStudentToClass(classId: string, studentId: string) {
    const student = await this.studentsModel.findById(studentId);
    student.classroom = classId;
    await student.save();

    await this.classroomService.updateSeats(classId, Seats.TAKEN);

    return student;
  }

  async removeStudentFromClass(studentId: string) {
    const student = await this.studentsModel.findById(studentId);
    const classId = student.classroom;
    student.classroom = "";
    await student.save();

    await this.classroomService.updateSeats(classId, Seats.AVAILABLE);

    return student;
  }
}
