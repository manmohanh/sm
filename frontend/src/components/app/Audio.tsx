import Button from "../shared/Button";
import Card from "../shared/Card";

const Audio = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card title="Manmohan">
          <div className="flex flex-col items-center">
            <img
              src="/images/profile.jpg"
              alt="avatar"
              className="w-40 h-40 rounded-full object-cover"
            />
          </div>
        </Card>

        <Card title="Vishal">
          <div className="flex flex-col items-center">
            <img
              src="/images/profile.jpg"
              alt="avatar"
              className="w-40 h-40 rounded-full object-cover"
            />
          </div>
        </Card>
      </div>

      <div className="border-b border-b-gray-200 -mx-5 my-4" />

      <div className="flex justify-between items-center">
        <div className="space-x-4">
          <button className="bg-amber-50 text-amber-500 w-12 h-12 rounded-full hover:bg-amber-500 hover:text-white">
            <i className="ri-mic-line"></i>
          </button>
        </div>
        <Button icon="close-circle-fill" type="danger">
          End
        </Button>
      </div>
    </div>
  );
};

export default Audio;
