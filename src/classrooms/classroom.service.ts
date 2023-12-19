import { Injectable, NotFoundException } from "@nestjs/common";
import { Classroom } from "./classroom.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Seats } from "src/enums";

@Injectable()
export class ClassroomService {
  constructor(
    @InjectModel(Classroom.name) private classroomsModel: Model<Classroom>
  ) {}

  async insertClassroom(_id: string, name: string, numberOfSeats: number) {
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

  async deleteClassroom(classroomId: string) {
    const result = await this.classroomsModel.deleteOne({ _id: classroomId });

    if (!result.deletedCount) {
      throw new NotFoundException("Could not find classroom");
    }

    return result;
  }

  async getAvailableClasses() {
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

  async updateSeats(classId: string, seats: Seats) {
    const classroom = await this.classroomsModel.findById(classId);
    classroom.numberOfSeatsLeft = classroom.numberOfSeatsLeft + seats;
    classroom.save();
  }
}
