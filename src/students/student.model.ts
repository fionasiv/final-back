import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { Types } from "mongoose";
import { Classroom } from "src/classrooms/classroom.model";

@Schema()
export class Student {
  @Prop({ required: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  profession: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
