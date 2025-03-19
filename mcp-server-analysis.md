# MCP-Fetch Server Technical Analysis

## Introduction

MCP-Fetch is a Model Context Protocol server designed to provide web content fetching capabilities. It allows MCP clients like Claude Desktop to fetch and process web content, with support for extracting readable content, processing images, and handling pagination. This document provides a technical analysis of the codebase, its structure, tools, and information flow.

## Codebase Structure

The codebase follows a simple structure with a single main file (`index.ts`) containing the core functionality:

```
mcp-fetch-personal/
├── .git/                 # Git repository files
├── index.ts              # Main server implementation
├── types.d.ts            # Type declarations for external modules
├── package.json          # NPM package configuration
├── package-lock.json     # NPM dependency lock file
├── tsconfig.json         # TypeScript configuration
├── biome.json            # Biome (linter/formatter) configuration
├── README.md             # Documentation
├── LICENSE               # License information
└── .gitignore            # Git ignore configuration
```

The server is implemented as a single executable module that can be run directly or installed via npm.

## Key Dependencies

The server relies on several important libraries:

- **@modelcontextprotocol/sdk**: The Model Context Protocol SDK that provides the server implementation and stdio transport
- **@mozilla/readability**: Library used to extract the main content from HTML pages
- **jsdom**: DOM implementation for Node.js used to parse HTML
- **turndown**: Converts HTML to Markdown
- **robots-parser**: Parses robots.txt files to respect web crawling rules
- **sharp**: Image processing library used for optimizing and manipulating images
- **zod**: Schema validation library
- **zod-to-json-schema**: Converts Zod schemas to JSON Schema format
- **node-fetch**: HTTP client for making web requests

## Key Components and Information Flow

### 1. Server Initialization

The server is initialized using the MCP SDK:

```typescript
const server = new Server(
  {
    name: "mcp-fetch",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);
```

The server uses a stdio transport to communicate with clients:

```typescript
const transport = new StdioServerTransport();
await server.connect(transport);
```

### 2. Tools Registration

The server registers a single tool called "fetch" with detailed documentation:

```typescript
server.setRequestHandler(
  ListToolsSchema,
  async (request: { method: "tools/list" }, extra: RequestHandlerExtra) => {
    const tools = [
      {
        name: "fetch",
        description: `...`,
        inputSchema: zodToJsonSchema(FetchArgsSchema),
      },
    ];
    return { tools };
  }
);
```

### 3. Parameter Validation

The server uses Zod for validating and transforming input parameters:

```typescript
const FetchArgsSchema = z.object({
  url: z.string().url(),
  maxLength: z.union([z.number(), z.string()])
    .transform((val) => Number(val))
    .pipe(z.number().positive().max(1000000))
    .default(20000),
  // Additional parameters...
});
```

This ensures that all parameters are properly typed and within acceptable ranges.

### 4. Content Fetching Process

The content fetching process follows these steps:

1. **URL Fetching**: The server fetches the requested URL using `node-fetch`
2. **Robots.txt Checking**: Checks if the request is allowed by the site's robots.txt
3. **Content Extraction**: For HTML content, extracts the main article using Readability
4. **Markdown Conversion**: Converts HTML to Markdown using Turndown
5. **Image Processing** (if enabled):
   - Extracts images from the article
   - Fetches image data
   - Processes images (resizing, optimization)
   - Merges multiple images vertically
   - Converts to optimized JPEG format
6. **Response Formatting**: Formats the response with content, images, and pagination info

### 5. Image Processing Pipeline

The image processing pipeline is sophisticated:

1. **Image Extraction**: Images are extracted from the HTML content
2. **Image Fetching**: Images are fetched using `node-fetch`
3. **Image Processing**:
   - GIF animation handling (first frame extraction)
   - Image resizing to respect maximum dimensions
   - Image optimization using Sharp/MozJPEG
   - Vertical merging of multiple images
4. **Response Formatting**: Images are base64-encoded and included in the response

```typescript
async function mergeImagesVertically(
  images: Buffer[],
  maxWidth: number,
  maxHeight: number,
  quality: number
): Promise<Buffer> {
  // Implementation details...
}
```

### 6. Request Handling

The server handles tool calls using a defined request handler:

```typescript
server.setRequestHandler(
  CallToolSchema,
  async (request: {...}, extra: RequestHandlerExtra) => {
    // Implementation details...
  }
);
```

The handler:
1. Validates the tool name and arguments
2. Checks robots.txt compliance (unless disabled)
3. Fetches and processes the URL content
4. Formats the response with content and images
5. Handles pagination information
6. Handles errors gracefully

### 7. Response Format

The server responds with a structured format:

```typescript
type MCPResponseContent =
  | { type: "text"; text: string }
  | { type: "image"; mimeType: string; data: string };
```

Responses include:
- Text content (markdown or raw)
- Base64-encoded images (if enabled)
- Pagination information
- Article title (if available)
- Error information (if applicable)

## Configuration Options

The server supports various configuration options:

1. **URL Processing Options**:
   - `maxLength`: Maximum content length to return
   - `startIndex`: Starting position in content
   - `raw`: Return raw content instead of processed markdown

2. **Image Processing Options**:
   - `enableFetchImages`: Enable fetching and processing of images
   - `imageMaxCount`: Maximum number of images to process
   - `imageStartIndex`: Starting position for image collection
   - `imageMaxHeight`: Maximum height of merged image
   - `imageMaxWidth`: Maximum width of merged image
   - `imageQuality`: JPEG quality setting

3. **Bot Control Options**:
   - `ignoreRobotsTxt`: Ignore robots.txt restrictions
   - Command-line flag `--ignore-robots-txt`

## Security Considerations

The server implements several security measures:

1. **Robots.txt Compliance**: Respects website crawling rules by default
2. **User-Agent Identification**: Uses appropriate user agent strings
3. **Error Handling**: Proper error handling to prevent crashes
4. **Resource Limits**: Implements limits on content size and image processing

## Communication Protocol

The server communicates with clients using the Model Context Protocol (MCP):

1. **Request Format**:
   ```json
   {
     "method": "tools/call",
     "params": {
       "name": "fetch",
       "arguments": { "url": "https://example.com", ... }
     }
   }
   ```

2. **Response Format**:
   ```json
   {
     "content": [
       { "type": "text", "text": "..." },
       { "type": "image", "mimeType": "image/jpeg", "data": "base64-encoded-data" }
     ]
   }
   ```

## Pagination Handling

The server implements pagination for both content and images:

1. **Content Pagination**: Uses `startIndex` and `maxLength` parameters
2. **Image Pagination**: Uses `imageStartIndex` and `imageMaxCount` parameters
3. **Pagination Information**: Includes information about remaining content and images

## Error Handling

The server handles errors gracefully:

1. **Network Errors**: Handles failures when fetching URLs
2. **Parsing Errors**: Handles failures when parsing HTML or extracting content
3. **Image Processing Errors**: Handles failures during image processing
4. **Parameter Validation Errors**: Returns clear error messages for invalid inputs

## Summary

The MCP-Fetch server is a well-designed implementation of the Model Context Protocol that provides web content fetching and processing capabilities. Its key strengths include:

1. **Robust Content Extraction**: Extracts readable content from complex web pages
2. **Advanced Image Processing**: Optimizes and processes images for efficient use
3. **Pagination Support**: Handles content and image pagination effectively
4. **Validation**: Implements thorough parameter validation
5. **Error Handling**: Gracefully handles various error conditions
6. **Robots.txt Compliance**: Respects web crawling rules

The server demonstrates effective use of TypeScript, proper error handling, and a clean architecture focused on a single responsibility: fetching and processing web content for AI agents. 