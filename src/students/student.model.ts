import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Student {
  @Prop({ required: true })
  _id: string

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  profession: string;

  @Prop({ type: String, ref: 'Classroom' })
  classroom: string
}

export const StudentSchema = SchemaFactory.createForClass(Student);
