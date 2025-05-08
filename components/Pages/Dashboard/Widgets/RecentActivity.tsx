import { Query } from "appwrite";
import dayjs from "dayjs";
import { Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  DATABASE_ID,
  databases,
  RECENT_ACTIVITY_COLLECTION_ID,
} from "../../../../constant/appwrite";
import { useStore } from "../../../../store/store";
import Space from "../../../space";
export default function RecentActivity() {
  const [activity, setActivity] = useState<Array<any>>([]);
  const { useStoreUser } = useStore();
  const { user } = useStoreUser();

  const { data } = useSWR("recent-activity", () =>
    databases.listDocuments(DATABASE_ID, RECENT_ACTIVITY_COLLECTION_ID, [
      Query.equal("userId", user?.$id),
      Query.orderDesc("$createdAt"),
    ])
  );

  useEffect(() => {
    if (data) {
      setActivity(data.documents);
    }
  }, [data]);

  return (
    <div className="recent-activity">
      <div className="recent-activity-header">
        <Space gap={10} align="evenly">
          <p className="recent-activity-title-header">Recent Activity</p>
          <i>
            <Ellipsis
              size={17}
              color="lightgray"
              style={{ cursor: "pointer" }}
            />
          </i>
        </Space>
        <p className="recent-activity-subtitle-header">
          {dayjs().format("dd, MMMM D, YYYY")} -{" "}
          {dayjs().subtract(1, "day").format("dd, MMMM D, YYYY")}
        </p>
      </div>
      <div className="recent-activity-item-container-wrapper">
        {activity.map((item, index) => (
          <div className="recent-activity-item-container" key={index}>
            <p className="recent-activity-title">{item.title}</p>
            <p className="recent-activity-subtitle">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
