import { Request, Response, NextFunction } from "express";
import * as httpError from "http-errors";
import validate_carassurance from "../validation/carAssurance.valid";
import CarAssuranceModel from "../models/carAssurance.model";
import CarModel from "../models/car.model";
import validate_car from "../validation/car.valid";
import { ICarAssurance } from "../@types/carAssurance.type";
import CarStickerModel from "../models/carSticker.model";
import CarPlateModel from "../models/carPlate.model";
import CarPinkCardModel from "../models/carPinkCard.model";
import CarTechControlModel from "../models/carTechControl.model";
import CarTypeModel from "../models/carType.model";
import CarOwnerModel from "../models/carOwner.model";
import { IUserRequest } from "../@types/user.type";
import PoliceAgentModel from "../models/policeAgent.model";

export default class Car {
  static async add(req: IUserRequest, res: Response, next: NextFunction) {
    const { chassisNumber, carBrand, photos } = req.body;
    console.log("The user : ", req.auth.id);
    try {
      const valid = validate_car(req.body);
      if (valid.error) {
        throw new httpError.Forbidden(valid.error?.details[0].message);
      } else {
        const carAssuranceResponse = await CarAssuranceModel.findByPk(
          req.body.CarAssuranceId
        );
        if (!carAssuranceResponse)
          throw new httpError.NotFound("Car Assurance not found !");

        const carStickerResponse = await CarStickerModel.findByPk(
          req.body.CarStickerId
        );
        if (!carStickerResponse)
          throw new httpError.NotFound("Car Sticker not found !");

        const carPlateResponse = await CarPlateModel.findByPk(
          req.body.CarPlateId
        );
        if (!carPlateResponse)
          throw new httpError.NotFound("Car Plate not found !");

        const carPinkCardResponse = await CarPinkCardModel.findByPk(
          req.body.CarPinkCardId
        );
        if (!carPinkCardResponse)
          throw new httpError.NotFound("Pink card not found !");

        const carTechControlResponse = await CarTechControlModel.findByPk(
          req.body.CarTechControlId
        );
        if (!carTechControlResponse)
          throw new httpError.NotFound("Tech control not found !");

        const carTypeResponse = await CarTypeModel.findByPk(req.body.CarTypeId);
        if (!carTypeResponse)
          throw new httpError.NotFound("Car Type not found !");

        const carOwnerResponse = await CarOwnerModel.findByPk(
          req.body.CarOwnerId
        );
        if (!carOwnerResponse)
          throw new httpError.NotFound("Car Owner not found !");

        const response = await req.auth.createCarModel({
          chassisNumber,
          carBrand,
          photos,
        });

        if (response) {
          await carAssuranceResponse?.setCarModel(response);
          await carStickerResponse?.setCarModel(response);
          await carPlateResponse?.setCarModel(response);
          await carTechControlResponse?.setCarModel(response);
          await carOwnerResponse?.setCarModel(response);
          await carPinkCardResponse?.setCarModel(response);
          await carTypeResponse?.setCarModel(response);

          res.status(200).json(<IServerResponse>{
            status: 200,
            data: response,
            message: "Car Created successfully !",
            error: null,
          });
        } else throw new httpError.NotFound("Admin not found !");
      }
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await CarModel.findAll();
      if (response) {
        res.status(200).json(<IServerResponse>{
          status: 200,
          message: "All Cars",
          data: response,
          error: null,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await CarModel.findByPk(req.params.id);
      if (response) {
        res.status(200).json(<IServerResponse>{
          status: 200,
          message: "The Car",
          data: response,
          error: null,
        });
      } else {
        throw new httpError.NotFound();
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateOne(req: Request, res: Response, next: NextFunction) {
    try {
      const valid = validate_car(req.body);
      if (valid.error) {
        throw new httpError.Forbidden(valid.error?.details[0].message);
      } else {
        const response = await CarModel.findByPk(req.params.id);
        if (response) {
          const response1 = await response.update({ ...response, ...req.body });
          res.status(200).json(<IServerResponse>{
            status: 200,
            message: "Car updated !",
            data: response1,
            error: null,
          });
        } else {
          throw new httpError.NotFound();
        }
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteOne(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await CarModel.findByPk(req.params.id);
      if (response) {
        await response.destroy();
        res.status(200).json(<IServerResponse>{
          status: 200,
          message: "Car Deleted !",
          data: {},
          error: null,
        });
      } else {
        throw new httpError.NotFound();
      }
    } catch (error) {
      next(error);
    }
  }
}
