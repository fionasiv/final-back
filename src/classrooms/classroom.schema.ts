import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
  IsInt,
  Min,
  Max,
  IsString,
} from '@nestjs/class-validator';

@Schema()
export class Classroom extends Document {
  @IsString()
  @Prop({ required: true, unique: true })
  _id: string;

  @IsString()
  @Prop({ required: true })
  name: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  @Prop({ required: true })
  capacity: number;

  @IsInt()
  @Min(0)
  @Max(1000)
  @Prop({ required: true })
  seatsLeft: number;
}

export const ClassroomSchema = SchemaFactory.createForClass(Classroom);
