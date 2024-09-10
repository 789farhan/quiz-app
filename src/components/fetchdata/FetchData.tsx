"use client";

import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function FetchData() {
  const [queries, setqueries] = useState<any>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [questionNumber, setquestionNumber] = useState<number>(1);
  const [index, setindex] = useState<number>(0);
  const [displaystartbtn, setdisplaystartbtn] = useState<string>("block");
  const [displaynextQuestionbtn, setdisplaynextQuestionbtn] =
    useState<string>("block");
  const [counter, setcounter] = useState<number>(1);
  const [displaycounter, setdisplaycounter] = useState<string>("hidden");
  const [questions, setquestions] = useState<string>("");
  const [displayquestions, setdisplayquestions] = useState<string>("hidden");
  const [options, setoptions] = useState<any[]>([]);
  const [CorrectAns, setCorrectAns] = useState<string>("");
  const [SelectedAnswerindex, setSelectedAnswerindex] = useState<any>(0);
  const [SelectedAns, setSelectedAns] = useState<string>("");
  const StartQuiz = async () => {
    try {
      setloading(true);
      setdisplaystartbtn("hidden");
      setdisplaycounter("bolck");
      setdisplayquestions("block");
      axios
        .get("https://opentdb.com/api.php?amount=10&category=25&type=multiple")
        .then((res) => {
          const response = res.data.results;
          console.log("response", response);
          queries.push(response);
          setqueries([...queries]);
          ResnderUI();
          setloading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const ResnderUI = () => {
    queries[0]
      ?.slice(index, questionNumber)
      .map((query: any, index: number) => {
        setquestions(query.question);
        if (!query.incorrect_answers.includes(query.correct_answer)) {
          const answerNotInclude: string[] = query?.incorrect_answers
            .concat(query.correct_answer)
            .sort();
          setoptions(answerNotInclude);
          answerNotInclude.find((obj: any) => {
            setCorrectAns((obj = query.correct_answer));
          });
        }
      });
  };

  useEffect(() => {
    ResnderUI();
  }, [counter]);

  const MoveToNextQuestion = () => {
    if (counter < 11) {
      setindex(index + 1);
      setquestionNumber(questionNumber + 1);
      setcounter(counter + 1);
    } else {
      setindex(0);
      setquestionNumber(1);
      setcounter(1);
      setdisplaynextQuestionbtn("hidden");
    }
  };

  const RestartAgain = async () => {
    await StartQuiz();
    setcounter(1);
  };

  const ChechAns = (evt: any) => {
    setSelectedAns(evt.currentTarget.innerText.valueOf());
    setSelectedAnswerindex(options.indexOf(SelectedAns));
    console.log(SelectedAns, SelectedAnswerindex);
  };

  return (
    <>
      <div className="wrapper">
        <div className="flex justify-center items-center flex-wrap ">
          <svg>
            <text x="50%" y="50%" dy=".35em" textAnchor="middle">
              {counter < 11 ? "QUIZ TIME!" : "Quiz Finished !"}
            </text>
          </svg>

          {!loading && counter < 11 && (
            <div className={`w-100 ${displaycounter} text-3xl text-center `}>
              <h1>{counter}/10</h1>
            </div>
          )}
        </div>

        <div className="Appbox" key={"jsx"}>
          {!loading ? (
            <Button
              onClick={StartQuiz}
              radius="full"
              className={`bg-gradient-to-tr ${displaystartbtn}  from-pink-500 to-yellow-500 text-white shadow-lg m-5`}
            >
              {" "}
              {counter < 11 ? "Start" : "ReStart"}
            </Button>
          ) : (
            <Spinner />
          )}

          {!loading && counter < 11 && (
            <button
              className={` m-3 group group-hover:before:duration-500 ${displayquestions}  group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4  origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-16 w-90 border text-left p-3 text-gray-50 text-base font-bold rounded-lg  overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg`}
            >
              {questions}
            </button>
          )}
          {counter < 11 &&
            !loading &&
            options.map((option: any, index: any) => {
              {
                console.log(
                  SelectedAns == CorrectAns && SelectedAnswerindex == index
                );
              }

              return (
                <div
                  className={`space-y-2 border-2 ${(
                    <>
                      {SelectedAns == CorrectAns && SelectedAnswerindex == index
                        ? " border-green-500"
                        : " border-red-500"}
                    </>
                  )} mb-1 `}
                  key={index}
                >
                  <label
                    className=" w-72 p-4 rounded-md flex justify-between items-center shadow"
                    onClick={ChechAns}
                  >
                    <div className="flex items-center space-x-5">
                      <h2 className="text-lg">{option}</h2>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      className="checked:border-indigo-500 h-5 w-5"
                    />
                  </label>
                </div>
              );
            })}

          {!loading && questions && counter < 11 && (
            <Button
              onClick={MoveToNextQuestion}
              radius="full"
              className={`bg-gradient-to-tr ${displaynextQuestionbtn} from-pink-500 to-yellow-500 text-white shadow-lg m-5`}
            >
              {" "}
              Move Next
            </Button>
          )}

          {counter > 10 && (
            <Button
              onClick={RestartAgain}
              className={`bg-gradient-to-tr   from-pink-500 to-yellow-500 text-white shadow-lg m-5`}
            >
              Restart
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
