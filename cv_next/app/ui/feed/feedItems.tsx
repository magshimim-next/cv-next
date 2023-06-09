"use client";
import CvModel from "@/app/models/cv";
import { Grid, Skeleton, Container } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import FirebaseHelper from "@/app/services/firebaseHelper";
import CVCard from "./cvCard";

//TESTING ONLY
//hook for generating different ids in mock models
const useIncrementState = (initialValue: number) => {
  const [value, setValue] = useState<number>(initialValue);
  const setValueWithIncrement = (newValue: number) => {
    setValue(newValue + 1);
  };
  return [value, setValueWithIncrement] as const;
};
//TESTING ONLY

function FeedItems() {
  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);


  //TESTING ONLY
  // const [count, setCount] = useIncrementState(2);

  // //mock fetch for testing
  // function mockFetch() {
  //   setCount(count);
  //   if (count < 500)
  //     return [
  //       new CvModel(
  //         "" + count,
  //         "" + count,
  //         "https://upload.wikimedia.org/wikipedia/commons/9/90/Resume_logo.jpeg",
  //         1,
  //         "cv number: " + count
  //       ),
  //     ];
  //   return null;
  // }
  //TESTING ONLY

  const [cvs, setCvs] = useState<CvModel[]>([
    new CvModel(
      "1",
      "1",
      "https://upload.wikimedia.org/wikipedia/commons/9/90/Resume_logo.jpeg",
      1,
      "cv number: 1"
    ), //TODO: find a way to not have a first mock model and still fetch
  ]);

  const fetchCVs = async () => {
    if(!initialLoaded){
      //to handle refresh in future
      FirebaseHelper.resetCvPeginationNumber();
      setInitialLoaded(true);
    }
    let result = null;
    result = await FirebaseHelper.getAllCvs(true);

    console.log("fetching..");
    if (result !== null) {
      setCvs(cvs.concat(result));
      console.log(result);
    } else {
      console.log("reached the end.");
    }
  };

  const lastCVRef = useRef<any>(null);

  const { ref, entry } = useIntersection({
    root: lastCVRef.current,
    threshold: 0, //% of the viewd element before the next fetch
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchCVs();
    }
  }, [entry]);

  return (
    <div>
      <Container fluid>
        <Grid gutter="xl">
          {cvs?.map((cv: CvModel, i) => {
            return (
              <Grid.Col xs={4}>
                <div key={cv.id} ref={i === cvs.length - 1 ? ref : null}>
                  <CVCard cv={cv} />
                </div>
              </Grid.Col>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default FeedItems;
