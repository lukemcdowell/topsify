import { cn, getEnvVariable } from "@/lib/utils";
import { afterEach, describe, expect, it } from "vitest";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignores falsy values", () => {
    expect(cn("foo", false && "bar", undefined, null as never)).toBe("foo");
  });

  it("deduplicates conflicting tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("handles conditional classes", () => {
    expect(cn("base", true && "active")).toBe("base active");
    expect(cn("base", false && "active")).toBe("base");
  });
});

describe("getEnvVariable", () => {
  afterEach(() => {
    delete process.env.TEST_ENV_VAR;
  });

  it("returns the value when the env var is set", () => {
    process.env.TEST_ENV_VAR = "hello";
    expect(getEnvVariable("TEST_ENV_VAR")).toBe("hello");
  });

  it("throws when the env var is not set", () => {
    expect(() => getEnvVariable("TEST_ENV_VAR")).toThrow(
      "Environment variable TEST_ENV_VAR is required",
    );
  });
});
