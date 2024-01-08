import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ClassroomService } from "./classroom.service";
import ClassroomDTO from "./interfaces/classroomDTO";

@Controller("classrooms")
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  async addClassroom(@Body("shobClass") newClassroom: ClassroomDTO) {
    try {
      await this.classroomService.insertClassroom(newClassroom);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getClassrooms() {
    try {
      const classrooms = await this.classroomService.getClassrooms();

      return classrooms;
    } catch (error) {
      throw error;
    }
  }

  @Get("available")
  async getAvailableClassrooms() {
    try {
      const availableClassrooms =
        await this.classroomService.getAvailableClasses();

      return availableClassrooms;
    } catch (error) {
      throw error;
    }
  }
  @Delete("")
  async removeClassroomById(@Body("id") classroomId: string): Promise<void> {
    try {
      await this.classroomService.deleteClassroom(classroomId);
    } catch (error) {
      throw error;
    }
  }
}
