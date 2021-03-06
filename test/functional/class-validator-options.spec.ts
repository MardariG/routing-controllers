import "reflect-metadata";
import {Length} from "@mardari/class-validator";
import {JsonController} from "../../src/decorator/JsonController";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {assertRequest} from "./test-utils";
import {defaultMetadataStorage} from "class-transformer/storage";
import {Get} from "../../src/decorator/Get";
import {QueryParam} from "../../src/decorator/QueryParam";
import {ResponseClassTransformOptions} from "../../src/decorator/ResponseClassTransformOptions";
import {RoutingControllersOptions} from "../../src/RoutingControllersOptions";

const chakram = require("chakram");
const expect = chakram.expect;

describe("parameters auto-validation", () => {

    class UserFilter {
        @Length(5, 15)
        keyword: string;
    }

    class UserModel {
        id: number;
        _firstName: string;
        _lastName: string;

        get name(): string {
            return this._firstName + " " + this._lastName;
        }
    }

    after(() => {
        defaultMetadataStorage.clear();
    });

    describe("should apply global validation enable", () => {

        let requestFilter: any;
        beforeEach(() => {
            requestFilter = undefined;
        });

        before(() => {
            getMetadataArgsStorage().reset();

            @JsonController()
            class ClassTransformUserController {

                @Get("/user")
                getUsers(@QueryParam("filter") filter: UserFilter): any {
                    requestFilter = filter;
                    const user = new UserModel();
                    user.id = 1;
                    user._firstName = "Umed";
                    user._lastName = "Khudoiberdiev";
                    return user;
                }

            }
        });

        const options: RoutingControllersOptions = {
            validation: true
        };

        let expressApp: any;
        before(done => expressApp = createExpressServer(options).listen(3001, done));
        after(done => expressApp.close(done));

        assertRequest([3001], "get", "user?filter={\"keyword\": \"Um\", \"__somethingPrivate\": \"blablabla\"}", response => {
            expect(response).to.have.status(400);
            expect(requestFilter).to.be.undefined;
        });
    });

    describe("should apply local validation enable", () => {

        let requestFilter: any;
        beforeEach(() => {
            requestFilter = undefined;
        });

        before(() => {
            getMetadataArgsStorage().reset();

            @JsonController()
            class ClassTransformUserController {

                @Get("/user")
                @ResponseClassTransformOptions({ excludePrefixes: ["_"] })
                getUsers(@QueryParam("filter", { validate: true }) filter: UserFilter): any {
                    requestFilter = filter;
                    const user = new UserModel();
                    user.id = 1;
                    user._firstName = "Umed";
                    user._lastName = "Khudoiberdiev";
                    return user;
                }

            }
        });

        let expressApp: any;
        before(done => expressApp = createExpressServer().listen(3001, done));
        after(done => expressApp.close(done));

        assertRequest([3001], "get", "user?filter={\"keyword\": \"Um\", \"__somethingPrivate\": \"blablabla\"}", response => {
            expect(response).to.have.status(400);
            expect(requestFilter).to.be.undefined;
        });
    });

    describe("should apply global validation options", () => {

        let requestFilter: any;
        beforeEach(() => {
            requestFilter = undefined;
        });

        before(() => {
            getMetadataArgsStorage().reset();

            @JsonController()
            class ClassTransformUserController {

                @Get("/user")
                getUsers(@QueryParam("filter") filter: UserFilter): any {
                    requestFilter = filter;
                    const user = new UserModel();
                    user.id = 1;
                    user._firstName = "Umed";
                    user._lastName = "Khudoiberdiev";
                    return user;
                }

            }
        });

        const options: RoutingControllersOptions = {
            validation: {
                skipMissingProperties: true
            }
        };

        let expressApp: any;
        before(done => expressApp = createExpressServer(options).listen(3001, done));
        after(done => expressApp.close(done));

        assertRequest([3001], "get", "user?filter={\"notKeyword\": \"Um\", \"__somethingPrivate\": \"blablabla\"}", response => {
            expect(response).to.have.status(200);
            expect(requestFilter).to.have.property("notKeyword");
        });
    });

    describe("should pass the valid param after validation", () => {

        let requestFilter: any;
        beforeEach(() => {
            requestFilter = undefined;
        });

        before(() => {
            getMetadataArgsStorage().reset();

            @JsonController()
            class UserController {

                @Get("/user")
                getUsers(@QueryParam("filter") filter: UserFilter): any {
                    requestFilter = filter;
                    const user = new UserModel();
                    user.id = 1;
                    user._firstName = "Umed";
                    user._lastName = "Khudoiberdiev";
                    return user;
                }

            }
        });

        const options: RoutingControllersOptions = {
            validation: true
        };

        let expressApp: any;
        before(done => expressApp = createExpressServer(options).listen(3001, done));
        after(done => expressApp.close(done));

        assertRequest([3001], "get", "user?filter={\"keyword\": \"Umedi\", \"__somethingPrivate\": \"blablabla\"}", response => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.eql({
                id: 1,
                _firstName: "Umed",
                _lastName: "Khudoiberdiev"
            });
            expect(requestFilter).to.be.instanceOf(UserFilter);
            expect(requestFilter).to.be.eql({
                keyword: "Umedi",
                __somethingPrivate: "blablabla",
            });
        });
    });

    describe("should contain param name on validation failed", () => {

        let requestFilter: any;
        beforeEach(() => {
            requestFilter = undefined;
        });

        before(() => {
            getMetadataArgsStorage().reset();

            @JsonController()
            class UserController {

                @Get("/user")
                getUsers(@QueryParam("filter") filter: UserFilter): any {
                    requestFilter = filter;
                    const user = new UserModel();
                    user.id = 1;
                    user._firstName = "Umed";
                    user._lastName = "Khudoiberdiev";
                    return user;
                }
            }
        });

        const options: RoutingControllersOptions = {
            validation: true
        };

        let expressApp: any;
        before(done => expressApp = createExpressServer(options).listen(3001, done));
        after(done => expressApp.close(done));

        const invalidFilter = {
            keyword: "aa"
        };

        assertRequest([3001], "get", `user?filter=${JSON.stringify(invalidFilter)}`, response => {
            expect(response).to.have.status(400);
            expect(response.body.paramName).to.equal("filter");
        });
    });
});
