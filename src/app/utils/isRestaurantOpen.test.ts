import { isRestaurantOpen } from "../utils/isRestaurantOpen";

describe("isRestaurantOpen", () => {
  it("should be open on Monday at 3pm", () => {
    const date = new Date("2025-08-18T15:00:00"); // Monday 3 PM
    const result = isRestaurantOpen(date);
    expect(result.isOpen).toBe(true);
    expect(result.dayName).toBe("Monday");
  });

  it("should be closed on Monday at 1pm", () => {
    const date = new Date("2025-08-18T13:00:00"); // Monday 1 PM
    const result = isRestaurantOpen(date);
    expect(result.isOpen).toBe(false);
  });

  it("should handle overnight Friday (2:30 AM Saturday)", () => {
    const date = new Date("2025-08-23T02:30:00"); // Saturday 2:30 AM
    const result = isRestaurantOpen(date);
    expect(result.isOpen).toBe(true);
    expect(result.dayName).toBe("Saturday");
  });

  it("should be closed early morning (Monday 5 AM)", () => {
    const date = new Date("2025-08-18T05:00:00"); // Monday 5 AM
    const result = isRestaurantOpen(date);
    expect(result.isOpen).toBe(false);
  });
});

