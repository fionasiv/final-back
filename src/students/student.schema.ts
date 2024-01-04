import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Document } from 'mongoose';
import { Classroom } from "src/classrooms/classroom.schema";

@Schema()
export class Student extends Document {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  age: number | undefined;

  @Prop({ required: true })
  profession: string;

  @Prop({ type: String, ref: Classroom.name, required: true })
  classroom: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);