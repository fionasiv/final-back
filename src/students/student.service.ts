import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Student } from "./student.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Document } from "mongoose";
import { ClassroomService } from "src/classrooms/classroom.service";
import { Seats } from "src/enums";
import { DeleteResult } from "mongodb";

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
    profession: string
  ) {
    const newStudent = new this.studentsModel({
      _id,
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

  
  async deleteStudent(studentId: string): Promise<DeleteResult> {
    const classId = (await this.getStudentById(studentId)).classroom;
    
    if (classId) {
      await this.classroomService.updateSeats(classId, Seats.AVAILABLE);
    }
    
    const result = await this.studentsModel
    .deleteOne({ _id: studentId })
    .exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException("Could not find student");
    }
    
    return result;
  }
  
  async getClassroomStudents(classId: string): Promise<Student[]> {
    const students = await this.getStudents();
    
    return students.filter((student) => student.classroom === classId);
  }
  
  async addStudentToClass(classId: string, studentId: string) {
    const student = await this.getStudentById(studentId);
    student.classroom = classId;
    await student.save();
    
    await this.classroomService.updateSeats(classId, Seats.TAKEN);
    
    return student;
  }
  
  async removeStudentFromClass(studentId: string) {
    const student = await this.getStudentById(studentId);
    const classId = student.classroom;
    student.classroom = "";
    await student.save();
    
    await this.classroomService.updateSeats(classId, Seats.AVAILABLE);
    
    return student;
  }
  
  private async getStudentById(studentId: string): Promise<Student> {
    let student: Document;
  
    try {
      student = await this.studentsModel.findById(studentId).exec();
    } catch (error) {
      throw new NotFoundException("Could not find student");
    }
  
    if (!student) {
      throw new NotFoundException("Could not find student");
    }
  
    return student.toObject();
  }
}
