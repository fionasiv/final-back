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
        numberOfSeatsLeft: newClassroom.numberOfSeats,
      };
      const newClassroomObject = new this.classroomsModel({
        ...classroom,
      });

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

  async getAvailableClasses(): Promise<ClassroomItem[]> {
    const classrooms = await this.getClassrooms();

    return classrooms
      .filter((classroom) => classroom.numberOfSeatsLeft > 0)
      .map((classroom) => {
        return {
          id: classroom._id,
          name: classroom.name,
        };
      });
  }

  async updateSeats(classId: string, seats: Seats): Promise<void> {
    const classroom = await this.getClassroomById(classId);
    classroom.numberOfSeatsLeft = classroom.numberOfSeatsLeft + seats;
    await classroom.save();
  }

  private async getClassroomById(
    classroomId: string
  ): Promise<
    Document<unknown, {}, Classroom> & Classroom & Required<{ _id: string }>
  > {
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
      fieldChecks.seatsAmountCheck(classroom.numberOfSeats);

    if (!isValid) {
      throw new UnprocessableEntityException("classroom params are invalid");
    }

    return isValid;
  }
}
