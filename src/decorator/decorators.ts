import {defaultMetadataArgsStorage} from "../index";
import {MiddlewareOptions} from "./options/MiddlewareOptions";
import {ResponseHandlerTypes} from "../metadata/types/ResponsePropertyTypes";
import {ResponseHandlerMetadataArgs} from "../metadata/args/ResponseHandleMetadataArgs";
import {MiddlewareMetadataArgs} from "../metadata/args/MiddlewareMetadataArgs";

/**
 * Registers a new middleware.
 */
export function Middleware(name?: string, options?: MiddlewareOptions) {
    return function (target: Function) {
        const metadata: MiddlewareMetadataArgs = {
            target: target,
            name: name,
            priority: options && options.priority ? options.priority : undefined,
            routes: options && options.routes ? options.routes : undefined
        };
        defaultMetadataArgsStorage().middlewares.push(metadata);
    };
}

/**
 * Annotation must be set to controller action and given to it code will be used as HTTP Status Code in the case
 * if response result is success.
 */
export function HttpCode(code: number) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: code,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.SUCCESS_CODE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * This decorator is used when user wants to get some specific HTTP code on empty result returned by a controller.
 */
export function EmptyResultCode(code: number) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: code,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.EMPTY_RESULT_CODE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * This decorator is used when user wants to get some specific HTTP code on null result returned by a controller.
 */
export function NullResultCode(code: number) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: code,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.NULL_RESULT_CODE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * This decorator is used when user wants to get some specific HTTP code on undefined result returned by a controller.
 */
export function UndefinedResultCode(code: number) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: code,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.UNDEFINED_RESULT_CODE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * Annotation must be set to controller action and given content-type will be set to response.
 */
export function ContentType(type: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: type,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.CONTENT_TYPE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * Annotation must be set to controller action and given content-type will be set to response.
 */
export function Header(name: string, value: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: name,
            secondaryValue: value,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.HEADER
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * Sets Location header with given value to the response.
 */
export function Location(value: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: value,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.LOCATION
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * Sets Redirect header with given value to the response.
 */
export function Redirect(value: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: value,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.REDIRECT
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}

/**
 * Specifies a template to be rendered by controller.
 */
export function Render(template: string) {
    return function (object: Object, methodName: string) {
        const metadata: ResponseHandlerMetadataArgs = {
            value: template,
            object: object,
            target: object.constructor,
            method: methodName,
            type: ResponseHandlerTypes.RENDERED_TEMPLATE
        };
        defaultMetadataArgsStorage().responseHandlers.push(metadata);
    };
}
