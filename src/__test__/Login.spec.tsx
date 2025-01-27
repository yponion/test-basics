import "@testing-library/jest-dom";
import {
  render,
  renderHook,
  waitFor,
  screen,
  fireEvent,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import useLogin from "../hooks/useLogin";
import * as nock from "nock";

const queryClient = new QueryClient({
  defaultOptions: {},
});

describe("로그인 테스트", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // 콘솔 에러가 찍히게되면 아무것도 하지 말아라
  });
  afterAll(() => {
    jest.restoreAllMocks(); // 위 코드 원상 복귀
  });
  test("로그인에 실패하면 에러 메시지가 나타난다.", async () => {
    // given - 로그인 화면이 그려진다.
    const routes = [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/login"],
      initialIndex: 0,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );

    // react-query 공식 문서에 나와있는 방법인데, 이건 반쪽짜리 테스트에 불과하여 아래 방식처럼 실제 유저가 입력하는 것처럼
    // // when - 사용자가 로그인에 실패한다.
    // const wrapper = ({ children }) => (
    //   <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    // );
    // const { result } = renderHook(() => useLogin(), { wrapper });=
    // // then - 에러 메시지가 나타난다.
    // await waitFor(() => expect(result.current.isError).toBe(true));

    // when - 사용자가 로그인에 실패한다.
    nock("http://inflearn.byeongjinkang.com")
      .post("/user/login/", {
        username: "worng@email.com",
        password: "worngPassword",
      })
      .reply(400, { msg: "NO_SUCH_USER" }); // 실제로 요청이 가게 되니까 nock 라이브러리로 HTTP request를 mocking 해서 400이 BadRequest 응답이 온 것처럼 처리

    const emailInput = screen.getByLabelText("이메일");
    const passwordInput = screen.getByLabelText("비밀번호");
    const loginButton = screen.getByRole("button", { name: "로그인" });
    fireEvent.change(emailInput, { target: { value: "worng@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "worngPassword" } });
    fireEvent.click(loginButton);

    const errorMessage = await screen.findByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
  });
});
