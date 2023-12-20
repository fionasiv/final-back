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
import { Student } from "./student.model";

@Controller("students")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async addStudent(@Body("newStudent") newStudent: Student) {
    try {
      await this.studentService.insertStudent(newStudent);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getStudents() {
    try {
      const students = await this.studentService.getStudents();

      return students;
    } catch (error) {
      throw error;
    }
  }

  @Delete(":id")
  async removeStudentById(@Param("id") studentId: string) {
    try {
      await this.studentService.deleteStudent(studentId);
    } catch (error) {
      throw error;
    }
  }

  @Get("classroom/:id")
  async getClassroomStudents(@Param("id") classroomId: string) {
    try {
      const classroomStudents =
        await this.studentService.getClassroomStudents(classroomId);

      return classroomStudents;
    } catch (error) {
      throw error;
    }
  }

  @Patch(":id/classroom/:classId")
  async addStudentToClass(
    @Param("id") studentId: string,
    @Param("classId") classroomId: string
  ) {
    try {
      const assignedStudent = await this.studentService.addStudentToClass(
        classroomId,
        studentId
      );

      return assignedStudent;
    } catch (error) {
      throw error;
    }
  }

  @Patch(":id/classroom")
  async removeStudentFromClass(@Param("id") studentId: string) {
    try {
      const unassignedStudent =
        await this.studentService.removeStudentFromClass(studentId);

      return unassignedStudent;
    } catch (error) {
      throw error;
    }
  }
}
