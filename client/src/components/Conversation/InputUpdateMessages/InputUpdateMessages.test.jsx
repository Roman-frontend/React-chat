import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { act } from "react-dom/test-utils";
// fireEvent vs userEvent - https://www.youtube.com/watch?v=3YrxcAXkUKQ
import userEvent from "@testing-library/user-event";
import { SnackbarProvider } from "notistack";
import TestRenderer from "react-test-renderer";
// https://www.apollographql.com/docs/react/development-testing/testing
import { MockedProvider } from "@apollo/client/testing";
import { InputUpdateMessages } from "./InputUpdateMessages";
import {
  CREATE_MESSAGE,
  CHANGE_MESSAGE,
  GET_MESSAGES,
} from "../ConversationGraphQL/queryes";
import "@testing-library/jest-dom";
import "@testing-library/dom";
import { GraphQLError } from "graphql";

// mocks - Тут я просто вказую який результат поверне сервер коли буде зроблено запит з заданими variables. Коли робиться запит з клієнта з такими даними: query: GET_MESSAGES, і з variables: {chatId: "6288671cb24f6a89e861b98d", chatType: "DirectMessage", userId: "client" },
const mocks = [
  {
    request: {
      query: GET_MESSAGES,
      variables: {
        chatId: "6288671cb24f6a89e861b98d",
        chatType: "DirectMessage",
        userId: "6288661c22cf8e8950762e14",
      },
    },
    result: {
      data: {
        activeChatId: "6288671cb24f6a89e861b98d",
        activeChatType: "DirectMessage",
        id: "6288661c22cf8e8950762e14",
        messages: {
          chatMessages: [
            {
              chatId: "6288671cb24f6a89e861b98d",
              chatType: "DirectMessage",
              createdAt: "1653392837121",
              id: "628cc5c56bd4857da0317e96",
              replyOn: null,
              senderId: "6288661c22cf8e8950762e14",
              text: "22",
              updatedAt: "1653392837121",
            },
          ],
          id: "6288671cb24f6a89e861b98d",
        },
      },
      // To simulate GraphQL errors, you define an errors field inside a mock's result field. The value of this field is an array of instantiated GraphQLError objects
      // errors: [new GraphQLError('Error!')],
    },
    // To simulate a network error, you can include an error field in your test's mock object, instead of the result field
    // error: new Error('An error occurred'),
  },
  {
    request: {
      query: CREATE_MESSAGE,
      variables: {
        chatId: "6288671cb24f6a89e861b98d",
        chatType: "DirectMessage",
        senderId: "6288661c22cf8e8950762e14",
        text: "222",
      },
    },
    result: {
      data: {
        message: {
          create: {
            chatId: "6288671cb24f6a89e861b98d",
            chatType: "DirectMessage",
            createdAt: "1653920408799",
            id: "6294d298b2f2005454532ac6",
            replyOn: null,
            senderId: "6288661c22cf8e8950762e14",
            text: "222",
            updatedAt: "1653920408799",
          },
        },
      },
    },
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("InputUpdateMessages", () => {
  afterEach(() => cleanup());

  describe("graphql query", () => {
    test("get messages - test loading after", async () => {
      act(() =>
        render(
          <MockedProvider mocks={mocks} addTypename={false}>
            <InputUpdateMessages />
          </MockedProvider>
        )
      );

      await TestRenderer.create(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InputUpdateMessages />
        </MockedProvider>
      );

      expect(await screen.findByText(/loading/i)).toBeInTheDocument();
      // Для тестування видалення лоадингу, після виконання строчки що нижче в screen.debug(); потрапить сторінка після лоадингу
      // await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
      // screen.debug();
    });

    test("get messages - test responce data after", async () => {
      await act(async () =>
        render(
          <MockedProvider mocks={mocks} addTypename={false}>
            <InputUpdateMessages />
          </MockedProvider>
        )
      );

      const component = await TestRenderer.create(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InputUpdateMessages />
        </MockedProvider>
      );

      // await act(() => sleep(500));
      // const tree = component.toJSON();
      // expect(tree).toMatchSnapshot();
      expect(await screen.findByLabelText("Enter text")).toBeInTheDocument();
      expect(await screen.findByText("22")).toBeInTheDocument();
      // screen.debug();
    });
  });

  describe("graphql mutation", () => {
    test("create message", async () => {
      try {
        await act(async () =>
          render(
            <MockedProvider mocks={mocks} addTypename={false}>
              <InputUpdateMessages inputRef={{ current: null }} />
            </MockedProvider>
          )
        );

        const component = await TestRenderer.create(
          <MockedProvider mocks={mocks} addTypename={false}>
            <InputUpdateMessages />
          </MockedProvider>
        );

        // const inputForKeyUp = await waitFor(() =>
        //   screen.getByTestId("on-key-up-main-input").querySelector("input")
        // );
        const inputForKeyUp = await waitFor(() =>
          screen.getByTestId("on-key-up-main-input")
        );
        expect(inputForKeyUp).toBeInTheDocument();
        fireEvent.change(inputForKeyUp, { target: { value: "222" } });
        // expect(inputForKeyUp).toHaveValue("222");
        expect(inputForKeyUp.value).toBe("222");
        expect(inputForKeyUp).toHaveAttribute("value", "222");
        expect(inputForKeyUp).toMatchSnapshot();
        await fireEvent.keyUp(inputForKeyUp, { key: "Enter" });
        // userEvent.keyUp(inputForKeyUp, "Enter");
        // userEvent.clear(inputForKeyUp);

        await waitFor(() => screen.debug());
      } catch (error) {
        console.log(error);
      }
    });
  });
});
