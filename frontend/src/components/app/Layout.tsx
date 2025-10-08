import { Link, Outlet, useLocation } from "react-router-dom";
import Avatar from "../shared/Avatar";
import Card from "../shared/Card";
import { useState } from "react";
import Dashboard from "./Dashboard";

const Layout = () => {
  const { pathname } = useLocation();
  const [LeftAsideSize, setLeftAsideSize] = useState(350);
  const RightAsideSize = 450;
  const collapseSize = 140;
  // const sectionDimension = {
  //   width: `calc(100% - ${LeftAsideSize + RightAsideSize}px)`,
  //   marginLeft: LeftAsideSize,
  // };

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

  return (
    <div className="min-h-screen">
      <aside
        className="bg-white fixed top-0 left-0 h-full p-8"
        style={{ width: LeftAsideSize, transition: "0.2s" }}
      >
        <div className="space-y-8 p-8 h-full rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900">
          {LeftAsideSize === collapseSize ? (
            <i className="ri-user-line text-xl text-gray-300 hover:text-white animate__animated animate__fadeIn"></i>
          ) : (
            <div className="animate__animated animate__fadeIn">
              <Avatar
                title="Manmohan"
                subtitle="Developer"
                image="/images/profile.jpg"
                titleColor="white"
              />
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

            <button className="flex items-center gap-2 text-gray-300 py-3 hover:text-white">
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
        className="py-8 px-1"
        style={{
          width: `calc(100% - ${LeftAsideSize + RightAsideSize}px)`,
          marginLeft: LeftAsideSize,
          transition: "0.3s",
        }}
      >
        <Card
          title={
            <div className="flex items-center gap-4">
              <button
                className="bg-gray-100 h-10 w-10 rounded-full hover:bg-slate-200"
                onClick={() =>
                  setLeftAsideSize(LeftAsideSize === 350 ? collapseSize : 350)
                }
              >
                <i className="ri-arrow-left-line"></i>
              </button>
              <h1>{getPathname(pathname)}</h1>
            </div>
          }
          divider
        >
          {pathname === "/app" ? <Dashboard /> : <Outlet />}
        </Card>
      </section>

      <aside
        className="bg-white fixed top-0 right-0 h-full p-8 overflow-auto space-y-8"
        style={{ width: RightAsideSize }}
      >
        <div className="h-[250px] overflow-auto">
          <Card title="Suggested" divider>
            <div className="space-y-8">
              {Array(24)
                .fill(0)
                .map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <img
                      src="/images/profile.jpg"
                      alt="profile"
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <h1 className="text-black font-medium">Rahul Kumar</h1>
                      <button className="bg-blue-500 text-white rounded px-2 py-1 text-xs hover:bg-blue-600 mt-1">
                        <i className="ri-user-add-line mr-1"></i>
                        Add Friend
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
        <Card title="My Friends" divider>
          <div className="space-y-5">
            {Array(20)
              .fill(0)
              .map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-3 rounded-lg flex justify-between"
                >
                  <Avatar
                    size="md"
                    image="/images/profile.jpg"
                    title="Manmohan"
                    subtitle={
                      <small
                        className={`${
                          index % 2 === 0 ? "text-zinc-400" : "text-green-400"
                        } font-medium`}
                      >
                        {index % 2 === 0 ? "Offline" : "Online"}
                      </small>
                    }
                  />

                  <div className="space-x-3">
                    <Link to="/app/chat">
                      <button
                        className="hover:text-blue-500 hover:cursor-pointer"
                        title="Chat"
                      >
                        <i className="ri-chat-ai-line"></i>
                      </button>
                    </Link>

                    <Link to="/app/audio-chat">
                      <button
                        className="hover:text-blue-500 hover:cursor-pointer"
                        title="Call"
                      >
                        <i className="ri-phone-line"></i>
                      </button>
                    </Link>

                    <Link to="/app/video-chat">
                      <button
                        className="hover:text-blue-500 hover:cursor-pointer"
                        title="Video Call"
                      >
                        <i className="ri-video-on-ai-line"></i>
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </aside>
    </div>
  );
};

export default Layout;
