import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Student {
  @Prop({ required: true })
  _id: number;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  profession: string;

  @Prop({ required: true })
  classId: number;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
