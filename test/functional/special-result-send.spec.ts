import "reflect-metadata";

import {createReadStream} from "fs";
import * as path from "path";
import {createExpressServer, getMetadataArgsStorage} from "../../src/index";
import {assertRequest} from "./test-utils";
import {JsonController} from "../../src/decorator/JsonController";
import {Get} from "../../src/decorator/Get";
import {ContentType} from "../../src/decorator/ContentType";

const chakram = require("chakram");
const expect = chakram.expect;

describe("special result value treatment", () => {

    const rawData = [0xFF, 0x66, 0xAA, 0xCC];

    before(() => {

        // reset metadata args storage
        getMetadataArgsStorage().reset();

        @JsonController()
        class HandledController {

            @Get("/stream")
            @ContentType("text/plain")
            getStream() {
                return createReadStream(path.resolve(__dirname, "../../../../test/resources/sample-text-file.txt"));
            }

            @Get("/buffer")
            @ContentType("application/octet-stream")
            getBuffer() {
                return new Buffer(rawData);
            }

            @Get("/array")
            @ContentType("application/octet-stream")
            getUIntArray() {
                return new Uint8Array(rawData);
            }

        }

    });

    let expressApp: any;
    before(done => expressApp = createExpressServer().listen(3001, done));
    after(done => expressApp.close(done));

    describe("should pipe stream to response", () => {
        assertRequest([3001], "get", "stream", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", (contentType: string) => {
                expect(contentType).to.match(/text\/plain/);
            });
            expect(response.body).to.be.equal("Hello World!");
        });
    });

    describe("should send raw binary data from Buffer", () => {
        assertRequest([3001], "get", "buffer", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "application/octet-stream");
            expect(response.body).to.be.equal(new Buffer(rawData).toString());
        });
    });

    describe("should send raw binary data from UIntArray", () => {
        assertRequest([3001], "get", "array", response => {
            expect(response).to.be.status(200);
            expect(response).to.have.header("content-type", "application/octet-stream");
            expect(response.body).to.be.equal(Buffer.from(rawData).toString());
        });
    });

});
