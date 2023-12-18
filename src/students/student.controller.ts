import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { StudentService } from "./student.service";

@Controller("students")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async addStudent(
    @Body("_id") _id: string,
    @Body("firstName") firstName: string,
    @Body("lastName") lastName: string,
    @Body("age") age: number,
    @Body("profession") profession: string
  ) {
    const newStudent = await this.studentService.insertStudent(
      _id,
      firstName,
      lastName,
      age,
      profession
    );
    return newStudent;
  }

  @Get()
  async getStudents() {
    const students = await this.studentService.getStudents();
    return students;
  }

  @Get(":id")
  async getStudent(@Param("id") studentId: string) {
    return await this.studentService.getStudentById(studentId);
  }

  @Delete(":id")
  async removeStudentById(@Param("id") studentId: string) {
    await this.studentService.deleteStudent(studentId);
    return { delete: "success" };
  }

  @Get("classroom/:id")
  async getClassroomStudents(@Param("id") classroomId: string) {
    const classroomStudents =
      await this.studentService.getClassroomStudents(classroomId);

    return classroomStudents;
  }

  @Patch(":id/classroom/:classId")
  async addStudentToClass(
    @Param("id") studentId: string,
    @Param("classId") classroomId: string
  ) {
    const newStudent = this.studentService.addStudentToClass(
      classroomId,
      studentId
    );

    return newStudent;
  }

  @Patch(":id/classroom")
  async removeStudentFromClass(@Param("id") studentId: string) {
    return this.studentService.removeStudentFromClass(studentId);
  }
}
