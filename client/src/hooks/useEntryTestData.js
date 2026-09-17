import { useQuery } from "@tanstack/react-query";
import * as entryTestApi from "../api/entryTestApi.js";

// Fetch the list of all available entry tests
export const useTestList = () => {
  return useQuery({
    queryKey: ["entryTests", "list"],
    queryFn: entryTestApi.fetchEntryTests,
  });
};

// Fetch calendar data (names and dates only)
export const useTestCalendar = () => {
  return useQuery({
    queryKey: ["entryTests", "calendar"],
    queryFn: entryTestApi.fetchTestCalendar,
  });
};

// Fetch details for a specific entry test by ID
export const useTestDetail = (testId) => {
  return useQuery({
    queryKey: ["entryTests", "detail", testId],
    queryFn: () => entryTestApi.fetchEntryTestDetail(testId),
    enabled: !!testId, // Only fetch if an ID is provided
  });
};
