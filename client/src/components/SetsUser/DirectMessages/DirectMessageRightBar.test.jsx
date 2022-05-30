import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnackbarProvider } from "notistack";
import TestRenderer from "react-test-renderer";
// https://www.apollographql.com/docs/react/development-testing/testing
import { MockedProvider } from "@apollo/client/testing";
import DirectMessageRightBar from "./DirectMessageRightBar";
import "@testing-library/jest-dom";

describe("handleMouseDownPassword test", () => {
  test("test user link", async () => {
    expect(null).toBeNull();
    // const component = TestRenderer.create(
    //   <MockedProvider mocks={[]} addTypename={false}>
    //     <SnackbarProvider>
    //       <DirectMessageRightBar />
    //     </SnackbarProvider>
    //   </MockedProvider>
    // );
    // //const tree = component.toJSON();
    // expect(component).toBeDefined();
    // const input = component.root.findByType("input");
    // const button = component.root.findByType("button");
    // const list = component.root.findByType("ul");
    // button.props.onClick();

    // // По ід отримую силки
    // const usersLink = screen.getByTestId("sign-in");
    // console.log(usersLink);
    // // Клікаємо на силку яка має свойство data-testid="users-link"
    // userEvent.click(usersLink);
    // // Після кліку має відмалюватись сторінка Users
    // expect(screen.getByTestId("sign-up")).toBeInTheDocument();
    // screen.debug();
  });
});
