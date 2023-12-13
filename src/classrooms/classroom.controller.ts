import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClassroomService } from './classroom.service';

@Controller('classrooms')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Post()
  async addClassroom(
    @Body('_id') _id: string,
    @Body('name') name: string,
    @Body('numberOfSeats') numberOfSeats: number,
  ) {
    const newClassroom = await this.classroomService.insertClassroom(
      _id,
      name,
      numberOfSeats,
    );
    return newClassroom;
  }

  @Get()
  async getClassrooms() {
    const classrooms = await this.classroomService.getClassrooms();
    return classrooms;
  }

  @Get(':id')
  async getClassroom(@Param('id') classroomId: string) {
    return await this.classroomService.getClassroomById(classroomId);
  }

  @Patch(':id')
  async updateClassroom(
    @Param('id') classroomId: string,
    @Body('title') classroomName: string,
    @Body('description') classroomNumOfSeats: number,
    @Body('price') classroomSeatsLeft: number,
  ) {
    //   await this.classroomService.updateClassroom(classroomId, classroomName, classroomNumOfSeats, classroomSeatsLeft);
    return { update: 'success' };
  }

  @Delete(':id')
  async removeClassroomById(@Param('id') classroomId: string) {
    await this.classroomService.deleteClassroom(classroomId);
    return { delete: 'success' };
  }
}
