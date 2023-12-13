import { Injectable, NotFoundException } from '@nestjs/common';
import { Student } from './student.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class StudentService {
  private students: Student[] = [];

  constructor(
    @InjectModel(Student.name) private studentsModel: Model<Student>,
  ) {}

  async insertStudent(
    _id: string,
    firstName: string,
    lastName: string,
    age: number,
    profession: string,
    classId: number,
  ) {
    const newStudent = new this.studentsModel({
      _id,
      firstName,
      lastName,
      age,
      profession,
      classId,
    });
    const result = await this.studentsModel.create(newStudent);
    return result;
  }

  async getStudents(): Promise<Student[]> {
    const students = await this.studentsModel.find().exec();
    return students;
  }

  async getStudentById(studentId: string) {
    let student: Student;
    try {
      student = await this.findStudentById(studentId);
    } catch (error) {
      throw new NotFoundException('Could not find student');
    }
    if (!student) {
      throw new NotFoundException('Could not find student');
    }
    return student;
  }

  async deleteStudent(studentId: string) {
    const result = await this.studentsModel
      .deleteOne({ _id: studentId })
      .exec();
    console.log(result);
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find student');
    }
  }

  private async findStudentById(id: string): Promise<Student> {
    const student = await this.studentsModel.findById(id);
    if (!student) {
      throw new NotFoundException('could not find student');
    }
    return student;
  }
}
