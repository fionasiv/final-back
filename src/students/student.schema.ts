import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Student extends Document {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  age: number | null;

  @Prop({ required: true })
  profession: string;

  @Prop({ type: String, ref: "Classroom" })
  classroom: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);