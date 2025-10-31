/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Avatar from "../shared/Avatar";
import Card from "../shared/Card";
import { useContext, useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import Context from "../../Context";
import HttpInterceptor from "../../lib/HttpInterceptor";
import { v4 as uuid } from "uuid";
import { useMediaQuery } from "react-responsive";
import useSWR, { mutate } from "swr";
import Fetcher from "../../lib/Fetcher";
import CatchError from "../../lib/CatchError";
import Logo from "../shared/Logo";
import IconButton from "../shared/IconButton";
import FriendsOnline from "./friend/FriendsOnline";

const EightMinutesInMs = 8 * 60 * 1000;

const Layout = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const navigate = useNavigate();
  const { liveActiveSession } = useContext(Context);
  const { pathname } = useLocation();
  const params = useParams();
  const paramsArray = Object.keys(params);
  const [LeftAsideSize, setLeftAsideSize] = useState(0);
  const RightAsideSize = 450;
  const [collapseSize, setCollapseSize] = useState(0);
  // const sectionDimension = {
  //   width: `calc(100% - ${LeftAsideSize + RightAsideSize}px)`,
  //   marginLeft: LeftAsideSize,
  // };
  const { error } = useSWR("/auth/refresh-token", Fetcher, {
    refreshInterval: EightMinutesInMs,
    shouldRetryOnError: false,
  });
  const { session, setSession } = useContext(Context);

  const friendsUiBlackList = [
    "/app/friends",
    "/app/chat/id",
    "/app/audio-chat",
    "/app/video-chat",
  ];

  const isBlacklisted = friendsUiBlackList.some((path) => path === pathname);

  // useEffect(() => {
  //   if (error) {
  //     logout();
  //   }
  // }, [error]);

  useEffect(() => {
    setLeftAsideSize(isMobile ? 0 : 350);
    setCollapseSize(isMobile ? 0 : 140);
  }, [isMobile]);

  const logout = async () => {
    try {
      await HttpInterceptor.post("/auth/logout");
      navigate("/login");
    } catch (error) {
      CatchError(error);
    }
  };

  const getPathname = (path: string) => {
    return path.split("/").pop()?.split("-").join(" ");
  };
  const menus = [
    {
      icon: "ri-home-9-line",
      href: "/app/dashboard",
      label: "dashboard",
    },
    {
      icon: "ri-chat-smile-3-line",
      href: "/app/my-posts",
      label: "my posts",
    },
    {
      icon: "ri-group-line",
      href: "/app/friends",
      label: "friends",
    },
  ];

  const uploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = async () => {
      if (!input.files) return;
      const file = input.files[0];
      const path = `profile-pictures/${uuid()}.png`;
      const payload = {
        path,
        type: file.type,
        status: "public-read",
      };
      try {
        const options = {
          headers: {
            "Content-Type": file.type,
          },
        };
        const { data } = await HttpInterceptor.post("/storage/upload", payload);
        await HttpInterceptor.put(data.url, file, options);
        const { data: user } = await HttpInterceptor.put(
          "/auth/profile-picture",
          { path }
        );
        setSession({ ...session, image: user.image });
        mutate("/auth/refresh-token");
      } catch (error: unknown) {
        console.log(error);
      }
    };
  };

  const ActiveSessionUi = () => {
    if (!liveActiveSession){
      navigate("/app")
      return;
    }

    return (
      <div className="flex gap-3">
        <img
          src={liveActiveSession.image || "/image/profile.jpg"}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h1 className="font-medium capitalize">
            {liveActiveSession.fullname}
          </h1>
          <label className="text-xs text-green-400">Online</label>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <nav className="lg:hidden flex items-center justify-between bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 fixed top-0 left-0 z-[20000] w-full py-4 px-6 ">
        <Logo />
        <div className="flex gap-3">
          <IconButton
            onClick={logout}
            icon="logout-circle-line"
            type="secondary"
          />
          <Link to={"/app/friends"}>
            <IconButton icon="chat-ai-line" type="danger" />
          </Link>
          <IconButton
            onClick={() =>
              setLeftAsideSize(LeftAsideSize === 0 ? 250 : collapseSize)
            }
            icon="menu-3-line"
            type="warning"
          />
        </div>
      </nav>

      <aside
        className=" bg-white fixed top-0 left-0 h-full lg:p-8 z-[20000]"
        style={{ width: LeftAsideSize, transition: "0.2s" }}
      >
        <div className="space-y-8 p-8 h-full lg:rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900">
          {LeftAsideSize === collapseSize ? (
            <i className="ri-user-line text-xl text-gray-300 hover:text-white animate__animated animate__fadeIn"></i>
          ) : (
            <div className="animate__animated animate__fadeIn">
              {session && (
                <Avatar
                  title={session.fullname}
                  subtitle={session.email}
                  image={session.image || "/images/profile.jpg"}
                  titleColor="white"
                  onClick={uploadImage}
                />
              )}
            </div>
          )}

          <div>
            {menus.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="flex items-center gap-2 text-gray-300 py-3 hover:text-white"
              >
                <i className={`${item.icon} text-xl`} title={item.label}></i>
                <label
                  className={`capitalize ${
                    LeftAsideSize === collapseSize ? "hidden" : null
                  }`}
                >
                  {item.label}
                </label>
              </Link>
            ))}

            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-300 py-3 hover:text-white"
            >
              <i className="ri-logout-circle-r-line text-xl" title="Logout"></i>
              <label
                className={`${
                  LeftAsideSize === collapseSize ? "hidden" : null
                }`}
              >
                Logout
              </label>
            </button>
          </div>
        </div>
      </aside>

      <section
        className="lg:py-8 lg:px-1 p-4 space-y-8 mt-16 lg:mt-0"
        style={{
          width: isMobile
            ? "100%"
            : `calc(100% - ${LeftAsideSize + RightAsideSize}px)`,
          marginLeft: isMobile ? 0 : LeftAsideSize,
          transition: "0.3s",
        }}
      >
        {/* {!isBlacklisted && <FriendsRequest />} */}
        <Card
          title={
            <div className="flex items-center gap-4">
              <button
                className="lg:block hidden bg-gray-100 h-10 w-10 rounded-full hover:bg-slate-200"
                onClick={() =>
                  setLeftAsideSize(LeftAsideSize === 350 ? collapseSize : 350)
                }
              >
                <i className="ri-arrow-left-line"></i>
              </button>
              <h1>
                {paramsArray.length === 0 ? (
                  getPathname(pathname)
                ) : (
                  <ActiveSessionUi />
                )}
              </h1>
            </div>
          }
          divider
        >
          {pathname === "/app" ? <Dashboard /> : <Outlet />}
        </Card>
        {/* {!isBlacklisted && <FriendsSuggestion />} */}
      </section>

      <aside
        className="lg:block hidden bg-white fixed top-0 right-0 h-full p-8 overflow-auto space-y-8"
        style={{ width: RightAsideSize, transition: "0.2s" }}
      >
        <FriendsOnline />
      </aside>
    </div>
  );
};

export default Layout;
