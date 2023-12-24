import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonaryLayout from "./MasonaryLayout";
import Spinner from "./Spinner";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";

const PinDetail = ({ user }) => {
  const [mediaType, setMediaType] = useState(null);
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
         const query1 = pinDetailMorePinQuery(data[0]);

          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();

    if (pinDetail?.image) {
      setMediaType("image");
    } else if (pinDetail?.video) {
      setMediaType("video");
    } else {
      setMediaType(null);
    }
  }, [pinId, pinDetail]);

  const addComment = async () => {
    if(comment){
      setAddingComment(true);

      try {
        await client
                .patch(pinId)
                .setIfMissing({ comments: [] })
                .insert('before', 'comments[0]', [{
                  comment,
                  _key: uuidv4(),
                  postedBy: {
                    _type: 'postedBy',
                    _ref: user?._id,
                  }
                }])
                .commit()
                .then(() => {
                  fetchPinDetails();
                  setComment('');
                  setAddingComment(false);
                  window.location.reload();
                  
                })
      } catch (error) {
        console.error("Error saving pin:", error);
      }
    }
  }


  if (!pinDetail) return <Spinner message="loading..." />;
  return (
    <>
      <div
        className="flex flex-col md:flex-row xl:flex-row m-auto bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}>
        <div className="flex justify-center items-center md:items-start flex-initial">
          {mediaType === "image" && (
            <img
              src={pinDetail?.image && urlFor(pinDetail?.image)?.url()}
              alt="pin-detail"
              className="rounded-t-3xl rounded-b-lg w-full"
            />
          )}
          {mediaType === "video" && (
            <video
            width={350}
            height={300}
             controls={true}
              autoPlay={true}
              loop={true}
              src={pinDetail?.video?.asset?.url}
              className="rounded-lg"
            />
          )}
          
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between overflow-hidden">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail?.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none">
                <MdDownloadForOffline />
              </a>
            </div>
            <a href={pinDetail?.destination} target="_blank" rel="noreferrer" className="cursor-pointer underline">
              {pinDetail?.destination}
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail?.title}
            </h1>
            <p className="mt-3">{pinDetail?.about}</p>
          </div>
          <Link
            to={`/user-profile/${pinDetail?.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={pinDetail?.postedBy?.image}
              alt="user-profile"
            />
            <p className="font-semibold capitalize">
              {pinDetail?.postedBy?.userName}
            </p>
          </Link>
          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto ">
            {pinDetail?.comments?.map((comment, i) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={i}>
                <img
                  src={comment?.postedBy?.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment?.postedBy?.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap mt-6 gap-3">
            <Link to={`/user-profile/${pinDetail?.postedBy?._id}`}>
              <img
                className="w-10 h-10 rounded-full cursor-pointer"
                src={pinDetail?.postedBy?.image}
                alt="user-profile"
              />
            </Link>
            <input
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-xl focus:border-gray-300"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
              onClick={addComment}>
              {addingComment ? "posting comment"  : "Post"}
            </button>
              {addingComment && <p className="text-xl text-red-300 font-bold">slow server. please wait 30s. your comment will show above soon.</p>}
          </div>
        </div>
      </div>

      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
           More Like This ☝
          </h2>
          <MasonaryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="trying to get more like this..."  />
      )}
      {pins?.length === 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          No more pins like this
        </h2>
      )}
    </>
  );
};

export default PinDetail;
