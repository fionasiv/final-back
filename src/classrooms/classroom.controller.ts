import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
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
    const availableClassrooms =
      await this.classroomService.getAvailableClasses();

    return availableClassrooms;
  }
  
  @Delete(":id")
  async removeClassroomById(@Param("id") classroomId: string) {
    const result = await this.classroomService.deleteClassroom(classroomId);

    return result;
  }
}
