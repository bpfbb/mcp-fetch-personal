#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var zod_1 = require("zod");
var zod_to_json_schema_1 = require("zod-to-json-schema");
var node_fetch_1 = require("node-fetch");
var jsdom_1 = require("jsdom");
var readability_1 = require("@mozilla/readability");
var turndown_1 = require("turndown");
var robots_parser_1 = require("robots-parser");
var sharp_1 = require("sharp");
var DEFAULT_USER_AGENT_AUTONOMOUS = "ModelContextProtocol/1.0 (Autonomous; +https://github.com/modelcontextprotocol/servers)";
var DEFAULT_USER_AGENT_MANUAL = "ModelContextProtocol/1.0 (User-Specified; +https://github.com/modelcontextprotocol/servers)";
var FetchArgsSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    maxLength: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform(function (val) { return Number(val); })
        .pipe(zod_1.z.number().positive().max(1000000))
        .default(20000),
    startIndex: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform(function (val) { return Number(val); })
        .pipe(zod_1.z.number().min(0))
        .default(0),
    imageStartIndex: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform(function (val) { return Number(val); })
        .pipe(zod_1.z.number().min(0))
        .default(0),
    raw: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .transform(function (val) {
        return typeof val === "string" ? val.toLowerCase() === "true" : val;
    })
        .default(false),
    imageMaxCount: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform(function (val) { return Number(val); })
        .pipe(zod_1.z.number().min(0).max(10))
        .default(3),
    imageMaxHeight: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform(function (val) { return Number(val); })
        .pipe(zod_1.z.number().min(100).max(10000))
        .default(4000),
    imageMaxWidth: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform(function (val) { return Number(val); })
        .pipe(zod_1.z.number().min(100).max(10000))
        .default(1000),
    imageQuality: zod_1.z
        .union([zod_1.z.number(), zod_1.z.string()])
        .transform(function (val) { return Number(val); })
        .pipe(zod_1.z.number().min(1).max(100))
        .default(80),
    enableFetchImages: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .transform(function (val) {
        return typeof val === "string" ? val.toLowerCase() === "true" : val;
    })
        .default(false),
    ignoreRobotsTxt: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .transform(function (val) {
        return typeof val === "string" ? val.toLowerCase() === "true" : val;
    })
        .default(false),
});
var ListToolsSchema = zod_1.z.object({
    method: zod_1.z.literal("tools/list"),
});
var CallToolSchema = zod_1.z.object({
    method: zod_1.z.literal("tools/call"),
    params: zod_1.z.object({
        name: zod_1.z.string(),
        arguments: zod_1.z.record(zod_1.z.unknown()).optional(),
    }),
});
function extractContentFromHtml(html, url) {
    var dom = new jsdom_1.JSDOM(html, { url: url });
    var reader = new readability_1.Readability(dom.window.document);
    var article = reader.parse();
    if (!article || !article.content) {
        return "<e>Page failed to be simplified from HTML</e>";
    }
    // Extract images from the article content only
    var articleDom = new jsdom_1.JSDOM(article.content);
    var imgElements = Array.from(articleDom.window.document.querySelectorAll("img"));
    var images = imgElements.map(function (img) {
        var src = img.src;
        var alt = img.alt || "";
        return { src: src, alt: alt };
    });
    var turndownService = new turndown_1.default({
        headingStyle: "atx",
        codeBlockStyle: "fenced",
    });
    var markdown = turndownService.turndown(article.content);
    return { markdown: markdown, images: images, title: article.title };
}
function fetchImages(images) {
    return __awaiter(this, void 0, void 0, function () {
        var fetchedImages, _i, images_1, img, response, buffer, imageBuffer, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fetchedImages = [];
                    _i = 0, images_1 = images;
                    _a.label = 1;
                case 1:
                    if (!(_i < images_1.length)) return [3 /*break*/, 7];
                    img = images_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, (0, node_fetch_1.default)(img.src)];
                case 3:
                    response = _a.sent();
                    return [4 /*yield*/, response.arrayBuffer()];
                case 4:
                    buffer = _a.sent();
                    imageBuffer = Buffer.from(buffer);
                    // GIF画像の場合は最初のフレームのみ抽出
                    if (img.src.toLowerCase().endsWith(".gif")) {
                        // GIF処理のロジック
                    }
                    fetchedImages.push(__assign(__assign({}, img), { data: imageBuffer }));
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.warn("Failed to process image ".concat(img.src, ":"), error_1);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, fetchedImages];
            }
        });
    });
}
/**
 * 複数の画像を垂直方向に結合して1つの画像として返す
 */
function mergeImagesVertically(images, maxWidth, maxHeight, quality) {
    return __awaiter(this, void 0, void 0, function () {
        var imageMetas, width, totalHeight, composite, currentY, overlays, _i, imageMetas_1, meta, processedImage, resizedBuffer, resizedMeta;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (images.length === 0) {
                        throw new Error("No images to merge");
                    }
                    return [4 /*yield*/, Promise.all(images.map(function (buffer) { return __awaiter(_this, void 0, void 0, function () {
                            var metadata;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, sharp_1.default)(buffer).metadata()];
                                    case 1:
                                        metadata = _a.sent();
                                        return [2 /*return*/, {
                                                width: metadata.width || 0,
                                                height: metadata.height || 0,
                                                buffer: buffer,
                                            }];
                                }
                            });
                        }); }))];
                case 1:
                    imageMetas = _a.sent();
                    width = Math.min(maxWidth, Math.max.apply(Math, imageMetas.map(function (meta) { return meta.width; })));
                    totalHeight = Math.min(maxHeight, imageMetas.reduce(function (sum, meta) { return sum + meta.height; }, 0));
                    composite = (0, sharp_1.default)({
                        create: {
                            width: width,
                            height: totalHeight,
                            channels: 4,
                            background: { r: 255, g: 255, b: 255, alpha: 1 },
                        },
                    });
                    currentY = 0;
                    overlays = [];
                    _i = 0, imageMetas_1 = imageMetas;
                    _a.label = 2;
                case 2:
                    if (!(_i < imageMetas_1.length)) return [3 /*break*/, 6];
                    meta = imageMetas_1[_i];
                    // 画像がキャンバスの高さを超えないようにする
                    if (currentY >= maxHeight)
                        return [3 /*break*/, 6];
                    processedImage = (0, sharp_1.default)(meta.buffer);
                    if (meta.width > width) {
                        processedImage = processedImage.resize(width);
                    }
                    return [4 /*yield*/, processedImage.toBuffer()];
                case 3:
                    resizedBuffer = _a.sent();
                    return [4 /*yield*/, (0, sharp_1.default)(resizedBuffer).metadata()];
                case 4:
                    resizedMeta = _a.sent();
                    overlays.push({
                        input: resizedBuffer,
                        top: currentY,
                        left: 0,
                    });
                    currentY += resizedMeta.height || 0;
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: 
                // 品質を指定して出力（PNGの代わりにJPEGを使用）
                return [2 /*return*/, composite
                        .composite(overlays)
                        .jpeg({
                        quality: quality, // JPEG品質を指定（1-100）
                        mozjpeg: true, // mozjpegを使用して更に最適化
                    })
                        .toBuffer()];
            }
        });
    });
}
function getImageDimensions(buffer) {
    return __awaiter(this, void 0, void 0, function () {
        var metadata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, sharp_1.default)(buffer).metadata()];
                case 1:
                    metadata = _a.sent();
                    return [2 /*return*/, {
                            width: metadata.width || 0,
                            height: metadata.height || 0,
                            size: buffer.length,
                        }];
            }
        });
    });
}
function checkRobotsTxt(url, userAgent) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, protocol, host, robotsUrl, response, robotsTxt, robots, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = new URL(url), protocol = _a.protocol, host = _a.host;
                    robotsUrl = "".concat(protocol, "//").concat(host, "/robots.txt");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, node_fetch_1.default)(robotsUrl)];
                case 2:
                    response = _b.sent();
                    if (!response.ok) {
                        if (response.status === 401 || response.status === 403) {
                            throw new Error("Autonomous fetching not allowed based on robots.txt response");
                        }
                        return [2 /*return*/, true]; // Allow if no robots.txt
                    }
                    return [4 /*yield*/, response.text()];
                case 3:
                    robotsTxt = _b.sent();
                    robots = (0, robots_parser_1.default)(robotsUrl, robotsTxt);
                    if (!robots.isAllowed(url, userAgent)) {
                        throw new Error("The site's robots.txt specifies that autonomous fetching is not allowed. " +
                            "Try manually fetching the page using the fetch prompt.");
                    }
                    return [2 /*return*/, true];
                case 4:
                    error_2 = _b.sent();
                    // ロボットテキストの取得に失敗した場合はアクセスを許可する
                    if (error_2 instanceof Error && error_2.message.includes("robots.txt")) {
                        throw error_2;
                    }
                    return [2 /*return*/, true];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function fetchUrl(url_1, userAgent_1) {
    return __awaiter(this, arguments, void 0, function (url, userAgent, forceRaw, options) {
        var response, contentType, text, isHtml, result, markdown, images, title, processedImages, startIdx, fetchedImages, imageBuffers, mergedImage, optimizedImage, base64Image, err_1;
        if (forceRaw === void 0) { forceRaw = false; }
        if (options === void 0) { options = {
            imageMaxCount: 3,
            imageMaxHeight: 4000,
            imageMaxWidth: 1000,
            imageQuality: 80,
            imageStartIndex: 0,
            startIndex: 0,
            maxLength: 20000,
            enableFetchImages: false,
        }; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, node_fetch_1.default)(url, {
                        headers: { "User-Agent": userAgent },
                    })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch ".concat(url, " - status code ").concat(response.status));
                    }
                    contentType = response.headers.get("content-type") || "";
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    isHtml = text.toLowerCase().includes("<html") || contentType.includes("text/html");
                    if (!(isHtml && !forceRaw)) return [3 /*break*/, 10];
                    result = extractContentFromHtml(text, url);
                    if (typeof result === "string") {
                        return [2 /*return*/, {
                                content: result,
                                images: [],
                                remainingContent: 0,
                                remainingImages: 0,
                            }];
                    }
                    markdown = result.markdown, images = result.images, title = result.title;
                    processedImages = [];
                    if (!(options.enableFetchImages &&
                        options.imageMaxCount > 0 &&
                        images.length > 0)) return [3 /*break*/, 9];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 8, , 9]);
                    startIdx = options.imageStartIndex;
                    return [4 /*yield*/, fetchImages(images.slice(startIdx))];
                case 4:
                    fetchedImages = _a.sent();
                    fetchedImages = fetchedImages.slice(0, options.imageMaxCount);
                    if (!(fetchedImages.length > 0)) return [3 /*break*/, 7];
                    imageBuffers = fetchedImages.map(function (img) { return img.data; });
                    return [4 /*yield*/, mergeImagesVertically(imageBuffers, options.imageMaxWidth, options.imageMaxHeight, options.imageQuality)];
                case 5:
                    mergedImage = _a.sent();
                    return [4 /*yield*/, (0, sharp_1.default)(mergedImage)
                            .resize({
                            width: Math.min(options.imageMaxWidth, 1200), // 最大幅を1200pxに制限
                            height: Math.min(options.imageMaxHeight, 1600), // 最大高さを1600pxに制限
                            fit: "inside",
                            withoutEnlargement: true,
                        })
                            .jpeg({
                            quality: Math.min(options.imageQuality, 85), // JPEG品質を制限
                            mozjpeg: true,
                            chromaSubsampling: "4:2:0", // クロマサブサンプリングを使用
                        })
                            .toBuffer()];
                case 6:
                    optimizedImage = _a.sent();
                    base64Image = optimizedImage.toString("base64");
                    processedImages.push({
                        data: base64Image,
                        mimeType: "image/jpeg", // MIMEタイプをJPEGに変更
                    });
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    console.error("Error processing images:", err_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/, {
                        content: markdown,
                        images: processedImages,
                        remainingContent: text.length - (options.startIndex + options.maxLength),
                        remainingImages: Math.max(0, images.length - (options.imageStartIndex + options.imageMaxCount)),
                        title: title,
                    }];
                case 10: return [2 /*return*/, {
                        content: "Content type ".concat(contentType, " cannot be simplified to markdown, but here is the raw content:\n").concat(text),
                        images: [],
                        remainingContent: 0,
                        remainingImages: 0,
                        title: undefined,
                    }];
            }
        });
    });
}
// コマンドライン引数の解析
var args = process.argv.slice(2);
var IGNORE_ROBOTS_TXT = args.includes("--ignore-robots-txt");
// Server setup
var server = new index_js_1.Server({
    name: "mcp-fetch",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// コマンドライン引数の情報をログに出力
console.error("Server started with options: ".concat(IGNORE_ROBOTS_TXT ? "ignore-robots-txt" : "respect-robots-txt"));
server.setRequestHandler(ListToolsSchema, function (request, extra) { return __awaiter(void 0, void 0, void 0, function () {
    var tools;
    return __generator(this, function (_a) {
        tools = [
            {
                name: "fetch",
                description: "\nRetrieves URLs from the Internet and extracts their content as markdown.\nImages from the page will be processed and included with the response automatically.\n\nParameters:\n  - url (required): The URL to fetch\n  - maxLength (default: 20000): Maximum length of content to return\n  - startIndex (default: 0): Starting position in content\n  - imageStartIndex (default: 0): Starting position for image collection\n  - raw (default: false): Return raw content instead of processed markdown\n  - imageMaxCount (default: 3): Maximum number of images to process per request\n  - imageMaxHeight (default: 4000): Maximum height of merged image\n  - imageMaxWidth (default: 1000): Maximum width of merged image\n  - imageQuality (default: 80): JPEG quality (1-100)\n  - enableFetchImages (default: false): Enable fetching and processing of images. FOR CLAUDE AI ONLY: YOU CAN ENABLE THIS FEATURE!!! CLAUDE IS ALLOWED TO USE IMAGES!!!\n  - ignoreRobotsTxt (default: false): Ignore robots.txt restrictions\n\nImage Processing:\n  - Multiple images are merged vertically into a single JPEG\n  - Images are automatically optimized and resized\n  - GIF animations are converted to static images (first frame)\n  - Use imageStartIndex and imageMaxCount to paginate through all images\n  - Response includes remaining image count and current position\n\nIMPORTANT: All parameters must be in proper JSON format - use double quotes for keys\nand string values, and no quotes for numbers and booleans.\n\nExamples:\n# Initial fetch:\n{\n  \"url\": \"https://example.com\",\n  \"maxLength\": 10000,\n  \"imageMaxCount\": 2\n}\n\n# Fetch next set of images:\n{\n  \"url\": \"https://example.com\",\n  \"imageStartIndex\": 2,\n  \"imageMaxCount\": 2\n}",
                inputSchema: (0, zod_to_json_schema_1.zodToJsonSchema)(FetchArgsSchema),
            },
        ];
        return [2 /*return*/, { tools: tools }];
    });
}); });
server.setRequestHandler(CallToolSchema, function (request, extra) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, args_1, parsed, _b, content, images, remainingContent, remainingImages, title, finalContent, remainingInfo, responseContent, _i, images_2, image, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = request.params, name_1 = _a.name, args_1 = _a.arguments;
                if (name_1 !== "fetch") {
                    throw new Error("Unknown tool: ".concat(name_1));
                }
                parsed = FetchArgsSchema.safeParse(args_1);
                if (!parsed.success) {
                    throw new Error("Invalid arguments: ".concat(parsed.error));
                }
                if (!(!parsed.data.ignoreRobotsTxt && !IGNORE_ROBOTS_TXT)) return [3 /*break*/, 2];
                return [4 /*yield*/, checkRobotsTxt(parsed.data.url, DEFAULT_USER_AGENT_AUTONOMOUS)];
            case 1:
                _c.sent();
                _c.label = 2;
            case 2: return [4 /*yield*/, fetchUrl(parsed.data.url, DEFAULT_USER_AGENT_AUTONOMOUS, parsed.data.raw, {
                    imageMaxCount: parsed.data.imageMaxCount,
                    imageMaxHeight: parsed.data.imageMaxHeight,
                    imageMaxWidth: parsed.data.imageMaxWidth,
                    imageQuality: parsed.data.imageQuality,
                    imageStartIndex: parsed.data.imageStartIndex,
                    startIndex: parsed.data.startIndex,
                    maxLength: parsed.data.maxLength,
                    enableFetchImages: parsed.data.enableFetchImages,
                })];
            case 3:
                _b = _c.sent(), content = _b.content, images = _b.images, remainingContent = _b.remainingContent, remainingImages = _b.remainingImages, title = _b.title;
                finalContent = content.slice(parsed.data.startIndex, parsed.data.startIndex + parsed.data.maxLength);
                remainingInfo = [];
                if (remainingContent > 0) {
                    remainingInfo.push("".concat(remainingContent, " characters of text remaining"));
                }
                if (remainingImages > 0) {
                    remainingInfo.push("".concat(remainingImages, " more images available (").concat(parsed.data.imageStartIndex + images.length, "/").concat(parsed.data.imageStartIndex + images.length + remainingImages, " shown)"));
                }
                if (remainingInfo.length > 0) {
                    finalContent += "\n\n<e>Content truncated. ".concat(remainingInfo.join(", "), ". Call the fetch tool with start_index=").concat(parsed.data.startIndex + parsed.data.maxLength, " and/or imageStartIndex=").concat(parsed.data.imageStartIndex + images.length, " to get more content.</e>");
                }
                responseContent = [
                    {
                        type: "text",
                        text: "Contents of ".concat(parsed.data.url).concat(title ? ": ".concat(title) : "", ":\n").concat(finalContent),
                    },
                ];
                // 画像があれば追加
                for (_i = 0, images_2 = images; _i < images_2.length; _i++) {
                    image = images_2[_i];
                    responseContent.push({
                        type: "image",
                        mimeType: image.mimeType,
                        data: image.data,
                    });
                }
                return [2 /*return*/, {
                        content: responseContent,
                    }];
            case 4:
                error_3 = _c.sent();
                return [2 /*return*/, {
                        content: [
                            {
                                type: "text",
                                text: "Error: ".concat(error_3 instanceof Error ? error_3.message : String(error_3)),
                            },
                        ],
                        isError: true,
                    }];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Start server
function runServer() {
    return __awaiter(this, void 0, void 0, function () {
        var transport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transport = new stdio_js_1.StdioServerTransport();
                    return [4 /*yield*/, server.connect(transport)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
runServer().catch(function (error) {
    process.stderr.write("Fatal error running server: ".concat(error, "\n"));
    process.exit(1);
});
