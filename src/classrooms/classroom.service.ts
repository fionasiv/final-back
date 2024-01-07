import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Classroom } from "./classroom.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import ClassroomItem from "./interfaces/ClassroomItem";
import ClassroomDTO from "./interfaces/classroomDTO";
import { validate } from "@nestjs/class-validator";

@Injectable()
export class ClassroomService {
  constructor(
    @InjectModel(Classroom.name) private classroomsModel: Model<Classroom>
  ) {}

  async insertClassroom(newClassroom: ClassroomDTO): Promise<void> {
    try {
      const classroom = {
        ...newClassroom,
        seatsLeft: newClassroom.capacity,
      };
      validate(classroom);
      const newClassroomObject = new this.classroomsModel(classroom);

      await newClassroomObject.save();
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        console.error("Duplicate key error. Classroom already exists!");
        throw new ConflictException("classroom already exists");
      } else {
        console.error("An error occurred:", error);
        throw error;
      }
    }
  }

  async getClassrooms(): Promise<Classroom[]> {
    try {
      const classrooms = await this.classroomsModel.find().lean();

      return classrooms;
    } catch (error) {
      throw error;
    }
  }

  async deleteClassroom(classroomId: string): Promise<void> {
    const classroom = await this.getClassroomById(classroomId);
    try {
      const result = await this.classroomsModel.deleteOne(
        { _id: classroomId },
        { seatsLeft: { $eq: classroom.capacity } }
      );

      if (result.deletedCount === 0) {
        throw new NotFoundException("Could not find classroom");
      }
    } catch (error) {
      if (error.code === 1) {
        console.error("Document not found:", error.message);
        throw new NotFoundException("Could not find document");
      } else {
        console.error("Unexpected error:", error.message);
        throw error;
      }
    }
  }

  async getAvailableClasses(): Promise<ClassroomItem[]> {
    const classrooms = await this.getClassrooms();

    return classrooms
      .filter((classroom) => classroom.seatsLeft > 0)
      .map((classroom) => {
        return {
          id: classroom._id,
          name: classroom.name,
        };
      });
  }

  async updateSeats(classId: string, seats: 1 | -1): Promise<void> {
    const classroom = await this.getClassroomById(classId);
    classroom.seatsLeft = classroom.seatsLeft + seats;
    await classroom.save();
  }

  async getClassroomById(classroomId: string) {
    const classroom = await this.classroomsModel.findById(classroomId).exec();

    if (!classroom) {
      throw new NotFoundException("Could not find classroom");
    }

    return classroom;
  }
}
