import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async addStudent(
    @Body('_id') _id: string,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('age') age: number,
    @Body('profession') profession: string,
    @Body('classId')  classId: number | null
  ) {
    const newStudent = await this.studentService.insertStudent(
      _id,
      firstName,
      lastName,
      age,
      profession,
      classId
    );
    return newStudent;
  }

  @Get()
  async getStudents() {
    const students = await this.studentService.getStudents();
    return students;
  }

  @Get(':id')
  async getStudent(@Param('id') studentId: string) {
    return await this.studentService.getStudentById(studentId);
  }

  @Delete(':id')
  async removeStudentById(@Param('id') studentId: string) {
    await this.studentService.deleteStudent(studentId);
    return { delete: 'success' };
  }
}
