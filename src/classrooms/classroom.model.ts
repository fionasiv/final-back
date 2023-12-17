import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { Student } from "src/students/student.model";

@Schema()
export class Classroom {
  @Prop({ required: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  numberOfSeats: number;

  @Prop({ required: true })
  numberOfSeatsLeft: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', unique: true }] })
  students: [Student];
}

export const ClassroomSchema = SchemaFactory.createForClass(Classroom);
