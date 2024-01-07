import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
  IsInt,
  Length,
  Min,
  Max,
  IsString,
} from '@nestjs/class-validator';
import { HydratedDocument, Document } from "mongoose";
import { Classroom } from "src/classrooms/classroom.schema";

@Schema()
export class Student extends Document {
  @IsString()
  @Length(9, 9)
  @Prop({ required: true, unique: true })
  _id: string;

  @IsString()
  @Prop({ required: true })
  firstName: string;

  @IsString()
  @Prop({ required: true })
  lastName: string;

  @IsInt()
  @Min(1)
  @Max(120)
  @Prop()
  age: number | undefined;

  @IsString()
  @Prop({ required: true })
  profession: string;

  @IsString()
  @Prop({ type: String, ref: Classroom.name, default: ""})
  classroom: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
