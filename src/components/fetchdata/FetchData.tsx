"use client";

import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function FetchData() {
  const [questions, setquestions] = useState<any>([]);
  const [loading, setloading] = useState<boolean>(false);
  const [nextquestion, setnextquestion] = useState<number>(1);
  const [sliceindex, setsliceindex] = useState<number>(0);
  const [startbtn, setstartbtn] = useState<boolean>(false);
  const [displaystartbtn, setdisplaystartbtn] = useState<string>("block");
  const [displaymovebtn, setdisplaymovebtn] = useState<string>("block");
  const [displayrestartbtn, setdisplayrestartbtn] = useState<string>("hidden");
  const [counter, setcounter] = useState<number>(1);
  const [bordercolor, setborderColor] = useState<string>("red");
  const [correctAns, setcorrectAns] = useState<string>("");
  const [findanswer, setfindanswer] = useState<string[]>([]);
  const [statement, setstatement] = useState<string>("");
  const [options, setoptions] = useState<any[]>([]);
  let arrayofAnswers: any[];

  const apidata = async () => {
    try {
      setdisplaystartbtn("hidden");
      setstartbtn(true);
      setloading(true);
      setdisplaymovebtn("block");
      setdisplayrestartbtn("hidden");
      axios
        .get("https://opentdb.com/api.php?amount=10&category=25&type=multiple")
        .then((res) => {
          const response = res.data.results;
          questions.push(response);
          setquestions([...questions]);
          setloading(false);
          ResnderUI();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const ResnderUI = () => {
    questions[0]
      ?.slice(sliceindex, nextquestion)
      .map((query: any, index: number) => {
        setstatement(query.question);
        if (!query.incorrect_answers.includes(query.correct_answer)) {
          const answerNotInclude: string[] = query?.incorrect_answers
            .concat(query.correct_answer)
            .sort();
          setoptions(answerNotInclude);
        }
      });
  };

  useEffect(() => {
    if (counter > 10) {
      setdisplayrestartbtn("block");
      setdisplaymovebtn("hidden");
    } else {
      setdisplaymovebtn("block");
      setdisplayrestartbtn("hidden");
      ResnderUI();
    }
  }, [counter]);

  const MoveNextQuestion = () => {
    setnextquestion(nextquestion + 1);
    setsliceindex(sliceindex + 1);
    setcounter(counter + 1);
    if (counter > 10) {
      setcounter(0);
      setnextquestion(nextquestion);
      setsliceindex(sliceindex);
      setcounter(counter);
    }
  };

  const RestartQuiz = async () => {
    await apidata();
  };

  return (
    <>
      <div className="wrapper">
        <div className="flex justify-center items-center flex-wrap ">
          <svg>
            <text x="50%" y="50%" dy=".35em" textAnchor="middle">
              {counter == 11 ? " QUIZ FINISHED" : "QUIZ TIME!"}
            </text>
          </svg>
          {startbtn && !loading && counter < 11 ? (
            <div className="w-100 text-3xl text-center">
              <h1>{counter}/10</h1>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="Appbox" key={"jsx"}>
          <Button
            radius="full"
            className={`bg-gradient-to-tr ${displaystartbtn}  from-pink-500 to-yellow-500 text-white shadow-lg m-5`}
            onClick={apidata}
          >
            {" "}
            Start
          </Button>

          {!loading && counter <= 11  ? (
            <>
              <button className=" m-4 group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4  origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-16 w-90 border text-left p-3 text-gray-50 text-base font-bold rounded-lg  overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
                {statement && statement}
              </button>
              {options.map((item: any, indexnum: any) => {
                return (
                  <div
                    className={`space-y-2 border-2 border-${bordercolor}-500`}
                    key={indexnum}
                  >
                    <label className="has-[:checked]:bg-white/30 has-[:checked]:text-indigo-900 has-[:checked]:ring-indigo-200 has-[:checked]:ring-2 cursor-pointer bg-white/40 hover:bg-white/20 w-72 p-4 rounded-md flex justify-between items-center shadow">
                      <div className="flex items-center space-x-5">
                        <h2 className="text-lg">{item}</h2>
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
            </>
          ) : (
            <>
              <Spinner />
            </>
          )}
          {startbtn && !loading && counter != 11 ? (
            <Button
              radius="full"
              className={`bg-gradient-to-tr ${displaymovebtn} from-pink-500 to-yellow-500 text-white shadow-lg m-5`}
              onClick={MoveNextQuestion}
            >
              {" "}
              Move Next
            </Button>
          ) : (
            <Button
              className={`bg-gradient-to-tr ${displayrestartbtn} from-pink-500 to-yellow-500 text-white shadow-lg m-5`}
              onClick={RestartQuiz}
            >
              Restart
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
