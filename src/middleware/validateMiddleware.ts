import { NextFunction, Request, Response } from 'express';
import { passwordSchema } from '../utils/schemas/passwordSchema';

export const validateRequest = (requestParams: any[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        for (let param of requestParams) {
            if (checkParamPresent(Object.keys(req.body), param)) {
                let reqParam:any = req.body[param.param_key];
                if (!checkParamType(reqParam, param)) {
                    return res.status(400).json({
                        result: `${param.param_key} is of type ` +
                        `${typeof reqParam} but should be ${param.type}`
                    });
                } else {
                    if (!runValidators(reqParam, param)) {
                        return res.status(400).json({
                            result: `Validation failed for ${param.param_key}`
                        });
                    }
                }
            } else if (param.required){
                return res.status(400).json({
                    result: `Missing Parameter ${param.param_key}`
                });
            }
        }
        next();
    }
};

const checkParamPresent = (reqParams: any, paramObj: any) => {
    return (reqParams.includes(paramObj.param_key));
};

const checkParamType = (reqParam: any, paramObj: any) => {
    const reqParamType = typeof reqParam;
    return reqParamType === paramObj.type;
};

const runValidators = (reqParam: any, paramObj: any) => {
    if (paramObj.hasOwnProperty('validator_functions'))
        for (let validator of paramObj.validator_functions) 
            if (!validator(reqParam))
                return false
    return true;
};


export const validatePassword = (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
  
    const { error } = passwordSchema.validate(password);
  
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    next();
  };
  