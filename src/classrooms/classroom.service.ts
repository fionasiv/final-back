import { Injectable, NotFoundException } from '@nestjs/common';
import { Classroom } from './classroom.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ClassroomService {
  private classrooms: Classroom[] = [];

  constructor(
    @InjectModel(Classroom.name) private classroomsModel: Model<Classroom>,
  ) {}

  async insertClassroom(
    _id: string,
    name: string,
    numberOfSeats: number,
  ) {
    const numberOfSeatsLeft = numberOfSeats;
    const newClassroom = new this.classroomsModel({
      _id,
      name,
      numberOfSeats,
      numberOfSeatsLeft,
    });
    const result = await this.classroomsModel.create(newClassroom);
    return result;
  }

  async getClassrooms(): Promise<Classroom[]> {
    const classrooms = await this.classroomsModel.find().exec();
    return classrooms;
  }

  async getClassroomById(classroomId: string) {
    let classroom: Classroom;
    try {
      classroom = await this.findClassroomById(classroomId);
    } catch (error) {
      throw new NotFoundException('Could not find classroom');
    }
    if (!classroom) {
      throw new NotFoundException('Could not find classroom');
    }
    return classroom;
  }

  // async updateClassroom(
  //   classroomId: string,
  //   newName: string,
  //   newNumberOfSeats: number,
  //   newNumberOfSeatsLeft: number,
  // ) {
  //   const updatedClassRoom = {}
  //   if (newName) updatedClassRoom["name"] = newName;
  //   if (newNumberOfSeats) updatedClassRoom["numberOfSeats"] = newNumberOfSeats;
  //   if (newNumberOfSeatsLeft) updatedClassRoom["numberOfSeatsLeft"] = newNumberOfSeatsLeft;
  //   console.log(updatedClassRoom)

  //   const classroom = await this.classroomsModel.findOneAndUpdate({_id: classroomId}, updatedClassRoom).exec();
  //   await classroom.save();
  // }

  async deleteClassroom(classroomId: string) {
    const result = await this.classroomsModel
      .deleteOne({ _id: classroomId })
      .exec();
    console.log(result);
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find classroom');
    }
  }

  private async findClassroomById(id: string): Promise<Classroom> {
    const classroom = await this.classroomsModel.findById(id);
    if (!classroom) {
      throw new NotFoundException('could not find classroom');
    }
    return classroom;
  }
}
