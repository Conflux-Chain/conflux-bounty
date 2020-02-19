import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { PageLoadingComp } from '../components/PageLoading';
import { getQuery } from '../utils';
import PrivateRoute from '../components/PrivateRouter';

const Home = lazy(() => import('../pages/Home'));
const Policy = lazy(() => import('../pages/Policy'));
const Terms = lazy(() => import('../pages/Terms'));
const NotFound = lazy(() => import('../pages/404'));
const Example = lazy(() => import('../pages/examples'));
const UserInfo = lazy(() => import('../pages/UserInfo'));
const EditBounty = lazy(() => import('../pages/Bounty/editbounty'));
const ViewBounty = lazy(() => import('../pages/Bounty/viewbounty'));
const SignIn = lazy(() => import('../pages/SignIn'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const SignInSuccess = lazy(() => import('../pages/SignInSuccess'));
const SignUp = lazy(() => import('../pages/SignUp'));
const EditSolution = lazy(() => import('../pages/Solution/editsolution'));
const ViewSolution = lazy(() => import('../pages/Solution/viewsolution'));
const UpdateProgress = lazy(() => import('../pages/Solution/updateProgress'));
const BountySuccess = lazy(() => import('../pages/Bounty/success'));
const SolutionSuccess = lazy(() => import('../pages/Solution/success'));
const AccountHistory = lazy(() => import('../pages/UserInfo/account-history'));
const InviteFriends = lazy(() => import('../pages/UserInfo/inviteFriends'));
const Shop = lazy(() => import('../pages/UserInfo/shop'));
const Settings = lazy(() => import('../pages/UserInfo/settings'));
const Messages = lazy(() => import('../pages/UserInfo/messages'));
const Message = lazy(() => import('../pages/UserInfo/message'));
const MyLikes = lazy(() => import('../pages/UserInfo/my-likes'));
const MyBounty = lazy(() => import('../pages/Bounty/mybounty'));
const MySolution = lazy(() => import('../pages/Solution/mysolution'));
const FaqMore = lazy(() => import('../pages/Faq'));
const Faqs = lazy(() => import('../pages/UserInfo/faqs'));

function Router() {
  return (
    <Suspense fallback={<PageLoadingComp />}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/policy" exact component={Policy} />
        <Route path="/terms" exact component={Terms} />
        <Route path="/example" exact component={Example} />
        <PrivateRoute path="/user-info" exact component={UserInfo} />
        <PrivateRoute
          path="/create-bounty"
          exact
          render={args => (
            <EditBounty
              {...{
                ...args,
                pageType: 'create',
              }}
            />
          )}
        />
        <PrivateRoute
          path="/edit-bounty"
          exact
          render={args => (
            <EditBounty
              {...{
                ...args,
                pageType: 'edit',
              }}
            />
          )}
        />
        <Route path="/view-bounty" exact component={ViewBounty} />
        <PrivateRoute path="/my-bounty" exact component={MyBounty} />
        <PrivateRoute
          path="/create-bounty-success"
          exact
          render={args => (
            <BountySuccess
              {...{
                ...args,
                pageType: 'create',
              }}
            />
          )}
        />
        <PrivateRoute
          path="/edit-bounty-success"
          exact
          render={args => (
            <BountySuccess
              {...{
                ...args,
                pageType: 'edit',
              }}
            />
          )}
        />

        <Route path="/signin" exact component={SignIn} />
        <Route path="/reset-password" exact component={ResetPassword} />
        <Route path="/signin/success" exact component={SignInSuccess} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/third-party-signup/:userId" exact component={SignUp} />
        <Route path="/invitation/:invitationCode" exact component={SignUp} />
        <Route path="/faq-more" exact component={FaqMore} />
        <Route path="/faqs" exact component={Faqs} />

        <PrivateRoute
          path="/create-submission"
          exact
          render={args => (
            <EditSolution
              {...{
                ...args,
                pageType: 'create',
              }}
            />
          )}
        />
        <PrivateRoute
          path="/edit-submission"
          exact
          render={args => (
            <EditSolution
              {...{
                ...args,
                pageType: 'edit',
              }}
            />
          )}
        />
        <Route
          path="/view-submission"
          exact
          render={args => {
            const query = getQuery();
            return (
              <ViewSolution
                {...{
                  ...args,
                  submissionId: query.submissionId,
                  from: query.from,
                }}
              />
            );
          }}
        />
        <PrivateRoute path="/my-submission" exact component={MySolution} />
        <PrivateRoute path="/update-progress" exact component={UpdateProgress} />

        <PrivateRoute
          path="/create-submission-success"
          exact
          render={args => {
            return (
              <SolutionSuccess
                {...{
                  ...args,
                  pageType: 'create',
                }}
              />
            );
          }}
        />
        <PrivateRoute
          path="/edit-submission-success"
          exact
          render={args => {
            return (
              <SolutionSuccess
                {...{
                  ...args,
                  pageType: 'edit',
                }}
              />
            );
          }}
        />

        <PrivateRoute path="/account-history" exact component={AccountHistory} />
        <PrivateRoute path="/my-likes" exact component={MyLikes} />
        <PrivateRoute path="/invite-friends" exact component={InviteFriends} />
        <PrivateRoute path="/shop" exact component={Shop} />
        <PrivateRoute path="/settings" exact component={Settings} />
        <PrivateRoute path="/messages" exact component={Messages} />
        <PrivateRoute path="/message/:messageId" exact component={Message} />

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}
export default Router;
