import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Classroom extends Document {
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
