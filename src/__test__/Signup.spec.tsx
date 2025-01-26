import "@testing-library/jest-dom";
import SignupPage from "../pages/SignupPage";
import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {},
});

describe("회원가입 테스트", () => {
  test("환경설정 테스트", () => {
    // given - 회원가입 페이지가 그려짐
    const routes = [
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/signup"],
      initialIndex: 0,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
  });
});
