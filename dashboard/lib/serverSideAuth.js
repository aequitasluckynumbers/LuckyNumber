import { checkRouteAccess } from "@/utils/user/checkRouteAccess";
import { getUser } from "@/utils/user/getUser";

export const checkServerSideRouteAccess = async (
  context,
  roles,
  subroles,
  dataFetcher
) => {

  try {
    // check user have access to this route
    const user = await getUser(context);

    if (!checkRouteAccess(user, roles, subroles)) {
      return {
        props: {
          data: null,
          error: { status: 401 },
          user: user,
        },
      };
    }

    let data = null;

    if (dataFetcher) {
        data = await dataFetcher();
    }

    return {
      props: {
        data: data,
        error: null,
        user: user,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        data: null,
        error: { status: 500 },
        user: null,
      },
    };
  }
};
