import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ClassroomService } from "./classroom.service";

@Controller("classrooms")
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  async addClassroom(
    @Body("_id") _id: string,
    @Body("name") name: string,
    @Body("numberOfSeats") numberOfSeats: number
  ) {
    const newClassroom = await this.classroomService.insertClassroom(
      _id,
      name,
      numberOfSeats
    );

    return newClassroom;
  }

  @Get()
  async getClassrooms() {
    const classrooms = await this.classroomService.getClassrooms();

    return classrooms;
  }

  @Get("available")
  async getAvailableClassrooms() {
    const availableClassrooms = await this.classroomService.getAvailableClasses();

    return availableClassrooms;
  }

  @Get(":id")
  async getClassroom(@Param("id") classroomId: string) {
    const classroom = await this.classroomService.getClassroomById(classroomId);

    return classroom;
  }

  @Get(":id/students")
  async getStudents(@Param("id") classroomId: string) {
    const classroomStudents = await this.classroomService.getClassroomStudents(classroomId);

    return classroomStudents;
  }

  @Patch(":id/students")
  async addStudent(
    @Param("id") classroomId: string,
    @Body("studentId") studentId: string
  ) {
    const newStudent = this.classroomService.addStudentToClassroom(classroomId, studentId);

    return newStudent;
  }

  @Patch(":id/students/:studentId")
  async removeStudent(
    @Param("id") classroomId: string,
    @Param("studentId") studentId: string
  ) {
    return this.classroomService.removeStudentFromClassroom(
      classroomId,
      studentId
    );
  }

  @Delete(":id")
  async removeClassroomById(@Param("id") classroomId: string) {
    await this.classroomService.deleteClassroom(classroomId);

    return { delete: "success" };
  }
}
