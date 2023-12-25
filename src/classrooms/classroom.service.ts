import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Classroom } from "./classroom.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { Seats } from "src/enums";
import { fieldChecks } from "src/consts";
import ClassroomItem from "./interfaces/ClassroomItem";
import ClassroomDTO from "./interfaces/classroomDTO";

@Injectable()
export class ClassroomService {
  constructor(
    @InjectModel(Classroom.name) private classroomsModel: Model<Classroom>
  ) {}

  async insertClassroom(newClassroom: ClassroomDTO): Promise<void> {
    try {
      this.validateClassroom(newClassroom);
      const classroom = {
        ...newClassroom,
        seatsLeft: newClassroom.capacity,
      };
      const newClassroomObject = new this.classroomsModel(classroom);
      console.log(newClassroomObject);

      await newClassroomObject.save();
    } catch (error) {
      if (error.code === 11000 || error.code === 11001) {
        console.error("Duplicate key error. Classroom already exists!");
        throw new BadRequestException("classroom already exists");
      } else {
        console.error("An error occurred:", error);
        throw error;
      }
    }
  }

  async getClassrooms(): Promise<Classroom[]> {
    const classrooms = await this.classroomsModel.find().exec();

    return classrooms;
  }

  async deleteClassroom(classroomId: string): Promise<void> {
    const classroom = await this.getClassroomById(classroomId);
    if (classroom.seatsLeft !== classroom.capacity) {
      throw new BadRequestException("cannot delete a classroom with seats taken");
    } else {
      try {
        const result = await this.classroomsModel.deleteOne({ _id: classroomId });
  
        if (!result.deletedCount) {
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

  async updateSeats(classId: string, seats: Seats): Promise<void> {
    const classroom = await this.getClassroomById(classId);
    classroom.seatsLeft = classroom.seatsLeft + seats;
    await classroom.save();
  }

  async getClassroomById(
    classroomId: string
  ) {
    const classroom = await this.classroomsModel.findById(classroomId).exec();

    if (!classroom) {
      throw new NotFoundException("Could not find classroom");
    }

    return classroom;
  }

  private validateClassroom(classroom: ClassroomDTO) {
    const isValid =
      fieldChecks.idCheck(classroom._id) &&
      fieldChecks.onlyLettersCheck(classroom.name) &&
      fieldChecks.seatsAmountCheck(classroom.capacity);

    if (!isValid) {
      throw new UnprocessableEntityException("classroom params are invalid");
    }

    return isValid;
  }
}
