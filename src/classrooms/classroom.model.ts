import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Classroom {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  numberOfSeats: number;

  @Prop({ required: true })
  numberOfSeatsLeft: number;
}

export const ClassroomSchema = SchemaFactory.createForClass(Classroom);
