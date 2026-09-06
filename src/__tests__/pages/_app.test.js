import React from "react";
import { render, screen, act } from "@testing-library/react";
import App from "../../pages/_app";

jest.mock("next/dynamic", () => () => {
  const DynamicComponent = () => null;
  DynamicComponent.displayName = "LoadableComponent";
  return DynamicComponent;
});

jest.mock("../../components/CustomCursor", () => ({
  __esModule: true,
  default: () => null,
}));

describe("App component (pages/_app.js)", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderLoadedApp = (props) => {
    const view = render(<App {...props} />);
    act(() => {
      jest.advanceTimersByTime(550);
    });
    return view;
  };

  it("renders the given Component", () => {
    const MockPage = () => <div data-testid="mock-page" />;
    renderLoadedApp({ Component: MockPage, pageProps: {} });
    expect(screen.getByTestId("mock-page")).toBeInTheDocument();
  });

  it("passes pageProps to the Component", () => {
    const MockPage = ({ greeting }) => <h1>{greeting}</h1>;
    renderLoadedApp({
      Component: MockPage,
      pageProps: { greeting: "Hello EMRC" },
    });
    expect(
      screen.getByRole("heading", { name: "Hello EMRC" }),
    ).toBeInTheDocument();
  });

  it("passes all pageProps fields through to the Component", () => {
    const MockPage = ({ a, b }) => (
      <span>
        {a}-{b}
      </span>
    );
    renderLoadedApp({
      Component: MockPage,
      pageProps: { a: "foo", b: "bar" },
    });
    expect(screen.getByText("foo-bar")).toBeInTheDocument();
  });

  it("renders different Components when the prop changes", () => {
    const PageA = () => <div data-testid="page-a" />;
    const PageB = () => <div data-testid="page-b" />;

    const { rerender } = renderLoadedApp({
      Component: PageA,
      pageProps: {},
    });
    expect(screen.getByTestId("page-a")).toBeInTheDocument();
    expect(screen.queryByTestId("page-b")).not.toBeInTheDocument();

    act(() => {
      rerender(<App Component={PageB} pageProps={{}} />);
      jest.advanceTimersByTime(550);
    });
    expect(screen.getByTestId("page-b")).toBeInTheDocument();
    expect(screen.queryByTestId("page-a")).not.toBeInTheDocument();
  });
});
