import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../../pages/_app";

jest.mock("../../components/CustomCursor", () => ({
  __esModule: true,
  default: () => null,
}));

describe("App component (pages/_app.js)", () => {
  const renderLoadedApp = async (props) => {
    const view = render(<App {...props} />);
    await new Promise((resolve) => setTimeout(resolve, 550));
    return view;
  };

  it("renders the given Component", async () => {
    const MockPage = () => <div data-testid="mock-page" />;
    await renderLoadedApp({ Component: MockPage, pageProps: {} });
    expect(screen.getByTestId("mock-page")).toBeInTheDocument();
  });

  it("passes pageProps to the Component", async () => {
    const MockPage = ({ greeting }) => <h1>{greeting}</h1>;
    await renderLoadedApp({ Component: MockPage, pageProps: { greeting: "Hello EMRC" } });
    expect(
      screen.getByRole("heading", { name: "Hello EMRC" }),
    ).toBeInTheDocument();
  });

  it("passes all pageProps fields through to the Component", async () => {
    const MockPage = ({ a, b }) => (
      <span>
        {a}-{b}
      </span>
    );
    await renderLoadedApp({ Component: MockPage, pageProps: { a: "foo", b: "bar" } });
    expect(screen.getByText("foo-bar")).toBeInTheDocument();
  });

  it("renders different Components when the prop changes", async () => {
    const PageA = () => <div data-testid="page-a" />;
    const PageB = () => <div data-testid="page-b" />;

    const { rerender } = await renderLoadedApp({ Component: PageA, pageProps: {} });
    expect(screen.getByTestId("page-a")).toBeInTheDocument();
    expect(screen.queryByTestId("page-b")).not.toBeInTheDocument();

    rerender(<App Component={PageB} pageProps={{}} />);
    expect(screen.getByTestId("page-b")).toBeInTheDocument();
    expect(screen.queryByTestId("page-a")).not.toBeInTheDocument();
  });
});
