import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { StudentService } from "./student.service";
import { Student } from "./student.schema";

@Controller("students")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async addStudent(@Body("student") newStudent: Student) {
    try {
      await this.studentService.insertStudent(newStudent);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getStudents() {
    try {
      return await this.studentService.getStudents();
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async removeStudentById(@Body("id") studentId: string) {
    try {
      await this.studentService.deleteStudent(studentId);
    } catch (error) {
      throw error;
    }
  }

  @Get("classroom")
  async getClassroomStudents(@Body("id") classroomId: string) {
    try {
      return await this.studentService.getClassroomStudents(classroomId);
    } catch (error) {
      throw error;
    }
  }

  @Patch("classroom/new")
  async addStudentToClass(
    @Body("id") studentId: string,
    @Body("classId") classroomId: string
  ) {
    try {
      return await this.studentService.addStudentToClass(
        classroomId,
        studentId
      );
    } catch (error) {
      throw error;
    }
  }

  @Patch("classroom")
  async removeStudentFromClass(@Body("id") studentId: string) {
    try {
      return await this.studentService.removeStudentFromClass(studentId);
    } catch (error) {
      throw error;
    }
  }
}
